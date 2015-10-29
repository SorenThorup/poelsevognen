var win1 = Ti.UI.createWindow({
	backgroundColor: "yellow",
	title: "Pølsevogn!"
});

var navWin = Ti.UI.iOS.createNavigationWindow({
	window: win1	
});

var addNewPlaceBtn = Ti.UI.createButton({ 
    systemButton: Ti.UI.iPhone.SystemButton.ADD 
});

var filterBtn = Ti.UI.createButton({ 
    systemButton: Ti.UI.iPhone.SystemButton.ORGANIZE
});

win1.rightNavButtons = [filterBtn, addNewPlaceBtn];

var Map = require('ti.map');

var annotations = [];

var mapView = Map.createView({
    mapType: Map.NORMAL_TYPE,
    region: {latitude:55.6646255, longitude:12.5201512,
            latitudeDelta:0.03, longitudeDelta:0.03},
    animate:true,
    regionFit:true,
    userLocation:true,
    showUserLocation: true,
    annotations: annotations
});

win1.add(mapView);

var btnLogin = Ti.UI.createButton({
	title: 'Login',
	top: '20dpi',
	width: '100dpi',
	height: '30dpi'
});
win1.add(btnLogin);

/*var btnAddLocation = Ti.UI.createButton({
	title: 'Create',
	top: '150dpi',
	width: '100dpi',
	height: '30dpi'
});
win.add(btnAddLocation);

var btnGetLocations = Ti.UI.createButton({
	title: 'Get',
	top: '250dpi',
	width: '100dpi',
	height: '30dpi'
});
win.add(btnGetLocations);*/

navWin.open();

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 25;
Ti.Geolocation.getCurrentPosition(function(e) {
	Ti.App.Properties.setString('userLat', e.coords.latitude);
    Ti.App.Properties.setString('userLon', e.coords.longitude);
});

Ti.Geolocation.addEventListener('location', function(e) {
	Ti.App.Properties.setString('userLat', e.coords.latitude);
    Ti.App.Properties.setString('userLon', e.coords.longitude);
});


var Distance = require('distanceController');

var Cloud = require('ti.cloud');

if(Ti.App.Properties.hasProperty('username') && Ti.App.Properties.hasProperty('password')) {
	var username = Ti.App.Properties.getString('username');
	var password = Ti.App.Properties.getString('password');

	Cloud.Users.login({
	    login: username,
	    password: password
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        /*alert('LOGIN WITH SAVED CREDENTIALS Success:\n' +
	            'id: ' + user.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);*/
	            
	    Ti.App.Properties.setString('username', 'sorenthorup1@gmail.com');
	    Ti.App.Properties.setString('password', 'Sorent');
	    
	    getLocations();
	    } else {
	        alert('LOGIN WITH SAVED CREDENTIALS Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}

function getLocations() {
	Cloud.Places.query({
	    page: 1,
	    per_page: 20,
	    //response_json_depth: 2
	   //places_id: '55f5bade421c4483770ee37c'
	}, function (e) {
	    if (e.success) {
	        /*alert('QUERY Success:\n' +
	            'Count: ' + e.places.length);*/
	        var customAnnotation = Ti.UI.createImageView({
	        	image: 'images/hotDogIcon.png',
	        	height: '32dpi',
	        	width: '32dpi'
	        });
	        
	        for (var i = 0; i < e.places.length; i++) {
	            var place = e.places[i];
	            Ti.API.info(place);
	            var annotation = Map.createAnnotation({
	            	id: place.id,
				    latitude: place.latitude,
				    longitude: place.longitude,
				    title: place.name,
				    subtitle: place.address,
				    //pincolor:Map.ANNOTATION_BLUE,
				    image: 'images/hotDogIcon.png',
				    //draggable: false,
				    rightButton: Ti.UI.iPhone.SystemButton.INFO_DARK,
				    leftButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT,
				    myid: i, // Custom property to uniquely identify this annotation.
				    zipcode: place.postal_code,
				    city: place.city,
				    ratings_average: place.ratings_average
				});
				
				
				
				annotations.push(annotation);
				//Ti.API.info('i lat ' + annotations[i].latitude);
				//Ti.API.info('i long ' + annotations[i].longitude);
				//Ti.API.info(e.places);
	            /*alert('id: ' + place.id + '\n' +
	                  'name: ' + place.name + '\n' +
	                  'longitude: ' + place.longitude + '\n' +
	                  'latitude: ' + place.latitude + '\n' +
	                  'updated_at: ' + place.updated_at);*/
	        }
	        //Ti.API.info(annotations);
	        mapView.annotations = annotations;
		}
	});
}

btnLogin.addEventListener('click', function() {
	Ti.API.info('Login clicked!');
	Cloud.Users.login({
	    login: 'Sorenthorup1@gmail.com',
	    password: 'Sorent'
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        alert('LOGIN Success:\n' +
	            'id: ' + user.id + '\n' +
	            'sessionId: ' + Cloud.sessionId + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);
	            
	    Ti.App.Properties.setString('username', 'sorenthorup1@gmail.com');
	    Ti.App.Properties.setString('password', 'Sorent');
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});

	Cloud.SocialIntegrations.externalAccountLogin({
	    type: 'facebook',
	    token: 'CAAF31xjawVQBAPbz7gqOASdID6I4w4smSE5PZBONSM7izZAS0CZA5fp62iFjUyONv22mtAhQ1ZCPSa7rqpCjkgEiY1pq1iKqvfwEeCcN8dQkHCGrH1pIrJZAZCZA2drz0KFFwXeaZA7w76VHnxfB25QT375yJZChOQ7X95Ix68s6PxBb4n8QZCN9AehyM4ZAAB8vXRQLvZA1mMn8BIZBiiwF2ysGetVS8LawVeTUZD'
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        alert('Success:\n' +
	            'id: ' + user.id + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
	
	Cloud.SocialIntegrations.externalAccountLink({
	    type: 'facebook',
	    token: 'CAAF31xjawVQBAPbz7gqOASdID6I4w4smSE5PZBONSM7izZAS0CZA5fp62iFjUyONv22mtAhQ1ZCPSa7rqpCjkgEiY1pq1iKqvfwEeCcN8dQkHCGrH1pIrJZAZCZA2drz0KFFwXeaZA7w76VHnxfB25QT375yJZChOQ7X95Ix68s6PxBb4n8QZCN9AehyM4ZAAB8vXRQLvZA1mMn8BIZBiiwF2ysGetVS8LawVeTUZD'
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        alert('Success:\n' +
	            'id: ' + user.id + '\n' +
	            'first name: ' + user.first_name + '\n' +
	            'last name: ' + user.last_name);
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
});

//Ti.API.info(Ti.Facebook.accessToken);

/*btnAddLocation.addEventListener('click', function() {
	Cloud.Places.create({
	    name: 'Appcelerator HQ',
	    state: 'California',
	    website: 'http://www.appcelerator.com'
	}, function (e) {
	    if (e.success) {
	        var place = e.places[0];
	        alert('CREATE Success:\n' +
	            'id: ' + place.id + '\n' +
	            'name: ' + place.name + '\n' +
	            'updated_at: ' + place.updated_at);
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
});

btnGetLocations.addEventListener('click', function() {
	Cloud.Places.query({
	    page: 1,
	    per_page: 20,
	   //places_id: '55f5bade421c4483770ee37c'
	}, function (e) {
	    if (e.success) {
	        alert('QUERY Success:\n' +
	            'Count: ' + e.places.length);
	        for (var i = 0; i < e.places.length; i++) {
	            var place = e.places[i];
	            
	            var annotation = Map.createAnnotation({
				    latitude: place.latitude,
				    longitude: place.latitude,
				    title: place.name,
				    subtitle: place.address,
				    pincolor:Map.ANNOTATION_BLUE,
				    draggable: false,
				    myid: i // Custom property to uniquely identify this annotation.
				});
				
				annotations.push(annotation);
	            alert('id: ' + place.id + '\n' +
	                  'name: ' + place.name + '\n' +
	                  'longitude: ' + place.longitude + '\n' +
	                  'latitude: ' + place.latitude + '\n' +
	                  'updated_at: ' + place.updated_at);
	        }
	        mapView.setAnnotations(annotations);
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
});*/

addNewPlaceBtn.addEventListener('click', function() {
	Ti.API.info('Add new place clicked');
	var currentLat;
	var currentLon;
	Ti.Geolocation.getCurrentPosition(function(e) {
		currentLat = e.coords.latitude;
		currentLon = e.coords.longitude;
	});
	
	var addNewPlaceWin = Ti.UI.createWindow({
		//url:'new_window.js', 
	    title:'Add...',
	    backgroundColor: 'white',
	    barColor: 'white',
	    //includeOpaqueBars: true,
    	translucent: false,
	    //navBarHidden: false,
	    //modal: true 
	});

	var addNewNavWin = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
		window: addNewPlaceWin
	});
	
	var data = [];
	//var newPlaceSections = [{'headerTitle': 'header1', 'headerTitle': 'header2', 'headerTitle': 'header3'}];
	
	var address_section = Ti.UI.createTableViewSection({ headerTitle: 'Adresse' });
	//header1.add();
	//header1.add(Ti.UI.createTableViewRow({ title: 'Row2' }));
	
	var place_name_input_row = Ti.UI.createTableViewRow({ height: '44dpi', 'title': view_container_name, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_name = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var place_name_input = Ti.UI.createTextField({
		hintText: 'Name',
		width: Ti.UI.FILL,
		height: '40dpi',
		left: '15dpi',
	});
	view_container_name.add(place_name_input);
	place_name_input_row.add(view_container_name);
	
	
	var place_address_input_row = Ti.UI.createTableViewRow({ height: '44dpi', 'title': view_container_address, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_address = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var place_address_input = Ti.UI.createTextField({
		hintText: 'Address',
		width: Ti.UI.FILL,
		height: '40dpi',
		left: '15dpi',
	});
	view_container_address.add(place_address_input);
	place_address_input_row.add(view_container_address);
	
	
	var place_zipcode_input_row = Ti.UI.createTableViewRow({ height: '44dpi', 'title': view_container_zipcode, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_zipcode = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var place_zipcode_input = Ti.UI.createTextField({
		hintText: 'Zipcode',
		width: Ti.UI.FILL,
		height: '40dpi',
		left: '15dpi',
	});
	view_container_zipcode.add(place_zipcode_input);
	place_zipcode_input_row.add(view_container_zipcode);
	
	
	var place_city_input_row = Ti.UI.createTableViewRow({ height: '44dpi', 'title': view_container_city, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_city = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var place_city_input = Ti.UI.createTextField({
		hintText: 'City',
		width: Ti.UI.FILL,
		height: '40dpi',
		left: '15dpi',
	});
	view_container_city.add(place_city_input);
	place_city_input_row.add(view_container_city);
	
	
	address_section.add(place_name_input_row);
	address_section.add(place_address_input_row);
	address_section.add(place_zipcode_input_row);
	address_section.add(place_city_input_row);
	
	place_name_input.addEventListener('focus', function(e) {
		Ti.API.info('FOCUS');
		Ti.API.info(e.value + ' - ' + e.source + ' - ' + e.type + ' - ' + e.bubbles + ' - ' + e.cancelBubble);
	});
	
	place_name_input_row.addEventListener('focus', function(e) {
		Ti.API.info('FOCUS');
		Ti.API.info(e.value + ' - ' + e.source + ' - ' + e.type + ' - ' + e.bubbles + ' - ' + e.cancelBubble);
	});
	
	var description_section = Ti.UI.createTableViewSection({ headerTitle: 'Beskrivelse' });
	
	var place_description_input_row = Ti.UI.createTableViewRow({ height: '44dpi', 'title': view_container_description, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_description = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var place_description_input = Ti.UI.createTextArea({
		hintText: 'Description',
		width: Ti.UI.FILL,
		height: 'auto',
		left: '15dpi',
		maxLength: 200
	});
	view_container_description.add(place_description_input);
	place_description_input_row.add(view_container_description);
	
	
	description_section.add(place_description_input_row);
	
	
	var payment_section = Ti.UI.createTableViewSection({ headerTitle: 'Betaling' });
	
	var mobile_pay_row = Ti.UI.createTableViewRow({height: '44dpi', title: 'MobilePay', selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var mobile_pay_switch=Ti.UI.createSwitch({
	  style:Ti.UI.SWITCH_STYLE_CHECKBOX,
	  value:false,
	  right:0
	});
	mobile_pay_row.add(mobile_pay_switch);
	
	
	var swipp_row = Ti.UI.createTableViewRow({height: '44dpi', title: 'Swipp', selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var swipp_switch=Ti.UI.createSwitch({
	  style:Ti.UI.SWITCH_STYLE_CHECKBOX,
	  value:false,
	  right:0
	});
	swipp_row.add(swipp_switch);
	
	
	payment_section.add(mobile_pay_row);
	payment_section.add(swipp_row);
	
	
	var map_section = Ti.UI.createTableViewSection({ headerTitle: 'Placering' });
	
	var place_map_input_row = Ti.UI.createTableViewRow({ height: '150dpi', 'title': view_container_map, selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE });
	var view_container_map = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL
	});
	var annotations = [];
	var Place_Map = require('ti.map');
	var annotation = Map.createAnnotation({
	    latitude: 55.665355,
	    longitude: 12.516812,
	    //title: e.annotation.title,
	    //subtitle: e.annotation.subtitle,
	    //pincolor: Map.ANNOTATION_GREEN,
	    image: 'images/hotDogIcon.png',
	    canShowCallout: false,
	    draggable: true
	});
	var place_map = Place_Map.createView({
	    mapType: Place_Map.NORMAL_TYPE,
	    region: {latitude:55.665355, longitude:12.516812,
	            latitudeDelta:0.003, longitudeDelta:0.003},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    showUserLocation: true,
	    annotations: [annotation],
	    width: Ti.UI.FILL,
	    height: '200dpi'
	});
	view_container_map.add(place_map);
	place_map_input_row.add(view_container_map);
	
	
	map_section.add(place_map_input_row);
	
	place_map.addEventListener('pinchangedragstate', function(e) {
	    Ti.API.info("Annotation " + e.title + " clicked, id: " + e.annotation.myid+" Latitude "+e.annotation.latitude+" Longitude "+e.annotation.longitude);
	});


	var newPlaceData = [{}];
	data.push(address_section, description_section, payment_section, map_section);
	
	var newPlaceTableView = Ti.UI.createTableView({
		//top: '200dpi',
		style: Ti.UI.iPhone.TableViewStyle.GROUPED,
		data: data,
		//touchEnabled: false
	});
	addNewPlaceWin.add(newPlaceTableView);
	
	//newPlaceTableView.setFooterTitle('Footer Title');
	
	/*var nameInput = Ti.UI.createTextField({
		backgroundColor: 'gray',
		top: '50dpi',
		width: Ti.UI.FILL,
		height: '50dpi',
		borderWidth: 2,
	  	borderColor: 'green',
	  	borderRadius: 5
	});
	addNewPlaceWin.add(nameInput);
	
	var addressInput = Ti.UI.createTextField({
		backgroundColor: 'gray',
		top: '110dpi',
		width: Ti.UI.FILL,
		height: '50dpi',
		borderWidth: 2,
	  	borderColor: 'green',
	  	borderRadius: 5,
	});
	addNewPlaceWin.add(addressInput);*/
	
	var saveNewPlaceBtn = Ti.UI.createButton({
		title: 'SAVE',
		top: '150dpi'
	});
	//addNewPlaceWin.add(saveNewPlaceBtn);
	
	saveNewPlaceBtn.addEventListener('click', function() {
		
		Cloud.Places.create({
		    name: nameInput.getValue(),
		    address: addressInput.getValue(),
		    latitude: currentLat,
		    longitude: currentLon
		    //website: 'http://www.appcelerator.com'
		}, function (e) {
		    if (e.success) {
		    	addNewPlaceWin.close();
		        var place = e.places[0];
		        alert('CREATE Success:\n' +
		            'id: ' + place.id + '\n' +
		            'name: ' + place.name + '\n' +
		            'updated_at: ' + place.updated_at);
		        getLocations();
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
		
	});
	
	var cancelNewPlaceBtn = Ti.UI.createButton({
		title: 'Cancel',
		top: '180dpi'
	});
	
	//addNewPlaceWin.add(cancelNewPlaceBtn);
	addNewPlaceWin.rightNavButton = saveNewPlaceBtn;
	addNewPlaceWin.leftNavButton = cancelNewPlaceBtn;
	
	cancelNewPlaceBtn.addEventListener('click', function() {
		addNewNavWin.close();
	});
	
	//navWin.openWindow(addNewPlaceWin, {modal: true});
	addNewNavWin.open({modal: true});
});

// Handle click events on any annotations on this map.
mapView.addEventListener('click', function(e) {
    Ti.API.info("Annotation " + e.title + " clicked, id: " + e.annotation.myid);
    Ti.API.info('SOURCE: ' + e.clicksource);
    Ti.API.info('EVT: ' + JSON.stringify(e));
    
    if(e.clicksource == 'rightButton') {
    	var detail = Ti.UI.createWindow({
    		title: e.annotation.title,
    		backgroundColor: '#FFF',
    		backButtonTitle: '',
    		modal: true
    	});
    	
    	var detailWin = Ti.UI.createScrollView({
    		
    	});
    	detail.add(detailWin);
    	
    	var annotation = Map.createAnnotation({
		    latitude: e.annotation.latitude,
		    longitude: e.annotation.longitude,
		    title: e.annotation.title,
		    subtitle: e.annotation.subtitle,
		    //pincolor: Map.ANNOTATION_GREEN,
		    image: 'images/hotDogIcon.png',
		    canShowCallout: false
		});
		
    	var mapViewDetail = Map.createView({
		    mapType: Map.NORMAL_TYPE,
		    region: {latitude:55.6646255, longitude:12.5201512,
		            latitudeDelta:0.01, longitudeDelta:0.01},
		    animate:true,
		    regionFit:true,
		    userLocation: false,
		    showUserLocation: false,
		    annotations: [annotation],
		    top: 0,
		    height: '150dpi'
		});
		detailWin.add(mapViewDetail);
		
		var ratingView = Ti.UI. createView({
			//backgroundColor: 'gray',
			top: '150dpi',
			height: '50dpi',
			width: '200dpi',
			layout: 'horizontal',
		});
		
		var ratingLabel = Ti.UI.createLabel({
			text: 'rating avg: ' + e.annotation.ratings_average,
			font: { fontSize: 18, color: 'white' }
		});
		//ratingView.add(ratingLabel);
		
		var ratingItem1 = Ti.UI.createImageView({
			image: 'images/hotDogIcon.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
			//left: '50dpi'
		});
		var ratingItem2 = Ti.UI.createImageView({
			image: 'images/hotDogIcon.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem3 = Ti.UI.createImageView({
			image: 'images/hotDogIcon.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem4 = Ti.UI.createImageView({
			image: 'images/hotDogIcon.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem5 = Ti.UI.createImageView({
			image: 'images/hotDogIcon.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem6 = Ti.UI.createImageView({
			image: 'images/hotDogIconBW.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
			//left: '50dpi'
		});
		var ratingItem7 = Ti.UI.createImageView({
			image: 'images/hotDogIconBW.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem8 = Ti.UI.createImageView({
			image: 'images/hotDogIconBW.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem9 = Ti.UI.createImageView({
			image: 'images/hotDogIconBW.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		var ratingItem10 = Ti.UI.createImageView({
			image: 'images/hotDogIconBW.png',
			height: '40dpi',
			width: '40dpi',
			top: '5dpi',
		});
		
		if(e.annotation.ratings_average) {
			var x = e.annotation.ratings_average;
			switch(true) {
			    case (x > 0.5 && x < 1):
			        
			        break;
			    case (x > 1 && x < 1.5):
			        ratingView.add(ratingItem1);
			        break;
			    case (x > 1.5 && x < 2):
			        
			        break;
			    case (x > 2 && x < 2.5):
			        ratingView.add(ratingItem1);
			        ratingView.add(ratingItem2);
			        ratingView.add(ratingItem8);
			        ratingView.add(ratingItem9);
			        ratingView.add(ratingItem10);
			        break;
			    case (x > 3 && x < 3.5):
			        ratingView.add(ratingItem1);
			        ratingView.add(ratingItem2);
			        ratingView.add(ratingItem3);
			        ratingView.add(ratingItem9);
			        ratingView.add(ratingItem10);
			        break;
			    case (x > 3.5 && x < 4):
			        
			        break;
			    case (x > 4 && x < 4.5):
			        ratingView.add(ratingItem1);
			        ratingView.add(ratingItem2);
			        ratingView.add(ratingItem3);
			        ratingView.add(ratingItem4);
			        ratingView.add(ratingItem10);
			        break;
			    case (x > 4.5):
			        ratingView.add(ratingItem1);
					ratingView.add(ratingItem2);
					ratingView.add(ratingItem3);
					ratingView.add(ratingItem4);
					ratingView.add(ratingItem5);
			        break;
			    default:
			        ratingView.add(ratingItem6);
					ratingView.add(ratingItem7);
					ratingView.add(ratingItem8);
					ratingView.add(ratingItem9);
					ratingView.add(ratingItem10);
				}
			} else {
				Ti.API.info('RATING UNDEFINED');
				ratingView.add(ratingItem6);
				ratingView.add(ratingItem7);
				ratingView.add(ratingItem8);
				ratingView.add(ratingItem9);
				ratingView.add(ratingItem10);
		}
		
		/*ratingView.add(ratingItem1);
		ratingView.add(ratingItem2);
		ratingView.add(ratingItem3);
		ratingView.add(ratingItem4);
		ratingView.add(ratingItem5);*/
		detailWin.add(ratingView);
		
    	var nameLabel = Ti.UI.createLabel({
    		top: '200dpi',
    		width: Ti.UI.FILL,
    		left: '10dpi',
    		height: '20dpi',
    		text: e.annotation.title,
    		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    		font: { fontSize:18 }
    	});
    	detailWin.add(nameLabel);
    	
    	var addressLabel = Ti.UI.createLabel({
    		top: '230dpi',
    		left: '10dpi',
    		height: '20dpi',
    		width: Ti.UI.FILL,
    		text: e.annotation.subtitle + ', ' + e.annotation.zipcode + ' ' + e.annotation.city,
    		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    		font: { fontSize:12 }
    	});
    	detailWin.add(addressLabel);
    	
    	/*var currentLat;
		var currentLon;
		Ti.Geolocation.getCurrentPosition(function(e) {
			currentLat = e.coords.latitude;
			currentLon = e.coords.longitude;
		});
    	Ti.API.info(currentLat);
    	Ti.API.info(currentLon);*/
		//var userPosition = Distance.userPosition();
		
		/*var userLat = userPosition.coords.latitude;
		var userLon = userPosition.coords.longitude;*/
		Ti.API.info(Ti.App.Properties.getString('userLat'));
    	Ti.API.info(Ti.App.Properties.getString('userLon'));
		var userLat = Ti.App.Properties.getString('userLat');
    	var userLon = Ti.App.Properties.getString('userLon');
		var distance = Distance.distance(userLat, userLon, e.annotation.latitude, e.annotation.longitude);
		
    	var distanceLabel = Ti.UI.createLabel({
    		top: '230dpi',
    		right: '10dpi',
    		height: '20dpi',
    		text: distance + ' km',
    		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
    		font: { fontSize:12 }
    	});
    	detailWin.add(distanceLabel);
    	
    	var send = Titanium.UI.createButton({
		    title: 'Send',
		    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
		    color: '#000',
		    tintColor: '#000'
		});
		
		var camera = Titanium.UI.createButton({
		    systemButton: Titanium.UI.iPhone.SystemButton.CAMERA,
		});
		
		var cancel = Titanium.UI.createButton({
		    title: 'anmeldelse'
		});
		
		flexSpace = Titanium.UI.createButton({
		    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

    	var detailToolbar = Ti.UI.iOS.createToolbar({
    		top: '350dpi',
    		borderTop: true,
    		borderBottom: true,
    		items: [send, flexSpace, camera, flexSpace, cancel]
    	});
    	detailWin.add(detailToolbar);
    	
    	var reviewLabel = Ti.UI.createLabel({
    		top: '450dpi',
    		text: 'Reviews ',
			font: { fontSize: 18, color: 'blue' },
			id: e.annotation.id
    	});
    	detailWin.add(reviewLabel);
    	
    	var reviewsContainer = Ti.UI.createView({
    		backgroundcolor: 'green',
    		top: '500dpi',
    		height: Ti.UI.SIZE,
    		layout: 'vertical'
    	});
    	detailWin.add(reviewsContainer);
    	
    	reviewLabel.addEventListener('click', function(e) {
    		getReviews(e.source.id, reviewsContainer);
    	});
    	
    	reviewsContainer.addEventListener('postlayout', function() {
			console.log('POST LAYOUT FIRED');
			reviewsContainer.heigt = Ti.UI.SIZE;	
		});

    	navWin.openWindow(detail, {animated:true});
    	//detailWin.open();
    }
});


function getReviews(id, detailWin) {
	Cloud.Reviews.query({
	    //page: 1,
	    //per_page: 20,
	    places_id: '55fd46df1660780909118f93'
	    /*where: {
	        rating: { '$gt': 5.0 }
	    }*/
	}, function (e) {
	    if (e.success) {
	        alert('Success:\n' +
	            'Count: ' + e.reviews.length);
	        for (var i = 0; i < e.reviews.length; i++) {
	            var review = e.reviews[i];
	            
	            var reviewView = Ti.UI.createView({
	            	backgroundColor: 'gray',
	            	height: Ti.UI.SIZE,
	            	borderWidth: '1dpi',
	            	borderColor: 'cyan'
	            });
	            
	            var reviewerLabel = Ti.UI.createLabel({
	            	backgroundColor: 'red',
	            	top: '0dpi',
	            	left: '0dpi',
	            	height: '10dpi',
	            	width: '50%',
	            	text: review.user_id
	            });
	            reviewView.add(reviewerLabel);
	            
	            var formattedDate = String.formatDate(review.created_at);
	            Ti.API.info(review.created_at);
	            var dateLabel = Ti.UI.createLabel({
	            	backgroundColor: 'orange',
	            	top: '0dpi',
	            	right: '0dpi',
	            	height: '5dpi',
	            	width: '50%',
	            	text: review.created_at
	            });
	            reviewView.add(dateLabel);
	            
	            var divider = Ti.UI.createView({
	            	backgroundColor: 'white',
	            	top: '20dpi',
	            	height: '5dpi',
	            	width: Ti.UI.FILL
	            	//borderWidth: '1dpi',
	            	//borderColor: 'cyan'
	            });
	            reviewView.add(divider);
	            
	            var cont = Ti.UI.createTableViewRow({
	            	top: '200dpi',
	            	backgroundColor: 'yellow',
	            	height: '75dpi',
	            	width: Ti.UI.FILL,
	            	zIndex: 25
	            });
	            
	            
	            var review = Ti.UI.createTextArea({
	            	top: '25dpi',
	            	borderWidth: 2,
				  	borderColor: 'green',
				  	borderRadius: 5,
				  	color: '#888',
				  	font: {fontSize:20, fontWeight:'bold'},
				 	//keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
				  	//returnKeyType: Ti.UI.RETURNKEY_GO,
				  	textAlign: 'left',
				  	value: review.content,
				  	//top: 60,
				  	width: 300, height : 'auto'
	            });
	            review.add(cont);
	            reviewView.add(review);
	            
	            detailWin.add(reviewView);
	            /*alert('id: ' + review.id + '\n' +
	                'rating: ' + review.rating + '\n' +
	                'content: ' + review.content + '\n' +
	                'updated_at: ' + review.updated_at);*/
	        }
	    } else {
	        alert('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
}


var searchTableData = [];
filterBtn.addEventListener('click', function() {
	var searchWin = Ti.UI.createWindow({
    		backgroundColor: 'cyan',
    		//backButtonTitle: '',
    		//modal: true
    	});
    	
    	var searchBar = Ti.UI.createSearchBar({
    		barColor: 'red', 
		    showCancel: true,
		    autocorrect: true,
		    height: '43dpi',
		    hintText: 'Søg...',
		    top: 0,
    	});
    	
    	searchWin.add(searchBar);
    	
    	var searchTableView = Ti.UI.createTableView({
    		backgroundColor: 'yellow',
    		opacity: 0.5,
    		top: '43dpi',
    		title: 'Søg',
    		filterAttribute: 'title',
    		//data: searchTableData,
    		//search: searchBar
    	});
    	
    	searchWin.add(searchTableView);
    	/*var addressLabel = Ti.UI.createLabel({
    		top: 100,
    		height: '25dpi',
    		width: '200dpi',
    		text: e.annotation.subtitle
    	});
    	
    	detailWin.add(addressLabel);*/
    	navWin.openWindow(searchWin, {animated:true});
    	
    	searchBar.addEventListener('change', function(e) {
    		//getSearchLocations(e.value, searchTableView);
    		var search_str = e.value.toLowerCase();
    		Cloud.Places.query({
			    page: 1,
			    per_page: 20,
			    where: {
			    	name: { $regex: '^'+search_str }
			    }
			}, function (e) {
			    if (e.success) {
			    	//var searchTableData = [];
			    	//Ti.API.info(e.places);
			    	var data = [];
			        for (var i = 0; i < e.places.length; i++) {
			            var place = e.places[i];
			            Ti.API.info(place.name);
			            
			            var result = Ti.UI.createTableViewRow({
			            	title: place.name,
			            	subtitle: place.address,
			            	//hasDetail: true,
			            	myField: 'myField'
			            });
						
						data.push(result);
						//Ti.API.info('ROW: ' + JSON.stringify(result));
			        }
			        
			        //Ti.API.info(searchTableView.title);
			        Ti.API.info(data);
			        searchTableView.data = data;
			        searchBar.value = searchBar.value;
			        //searchTableView.hide();
			        //searchWin.hide();
				}
			});
    	});
});

function getSearchLocations(search_str, searchTableView) {
	var search_str = search_str.toLowerCase();
	Cloud.Places.query({
	    page: 1,
	    per_page: 20,
	    where: {
	    	name: { $regex: '^'+search_str }
	    }
	    //response_json_depth: 2
	   //places_id: '55f5bade421c4483770ee37c'
	}, function (e) {
	    if (e.success) {
	    	var searchTableData = [];
	    	Ti.API.info(e.places);
	        /*alert('QUERY Success:\n' +
	            'Count: ' + e.places.length);*/
	        for (var i = 0; i < e.places.length; i++) {
	            var place = e.places[i];
	            
	            var result = Ti.UI.createTableViewRow({
	            	title: e.places.name,
	            	subtitle: e.places.address
	            });
				
				searchTableData.push(result);
				//Ti.API.info('i lat ' + annotations[i].latitude);
				//Ti.API.info('i long ' + annotations[i].longitude);
				
	            /*alert('id: ' + place.id + '\n' +
	                  'name: ' + place.name + '\n' +
	                  'longitude: ' + place.longitude + '\n' +
	                  'latitude: ' + place.latitude + '\n' +
	                  'updated_at: ' + place.updated_at);*/
	        }
	        
	        Ti.API.info(searchTableView.title);
	        Ti.API.info(JSON.stringify(searchTableData));
	        searchTableView.data = searchTableData;
		}
	});
}


/*mapView.addEventListener('click', function(e) {
	Ti.API.info('ANNOTATION RIGHT-CLICKED');
    if (e.clicksource == 'rightPane') {
      	var annotation = e.annotation;
 
    if (annotation) {
      	var title = annotation.title;
		 Ti.API.info('Annotation Title: ' + title);
      // keep it simple just for testing
      var tableData = [
        {title: title}
      ];
    }
 
      //detailView.data = tableData;
 
      	detailWindow.title = title;
 
      	detailWindow.open({
        	animate: true,
        	fullscreen: true
      });
    }
});*/
