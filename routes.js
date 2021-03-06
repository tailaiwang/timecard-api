const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectId; 

const app = express();
const routes = express.Router();

routes.route('/mongofinesse').get((req,res)=>{

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("timecards").find({}).toArray(function(err, result) {
			var tm = result[1];
			tm['id']="ALC420";
			delete tm['_id'];
			dbo.collection("timecards").insertOne(tm, function(err, res) {
	  			if (err) throw err;
		  		console.log("1 document inserted");
	  		});
		});
		
	});
	res.json();

});

routes.route('/').get((req,res)=>{
	res.send('hello world');
});

routes.route('/workerRegister').get((req,res)=>{
	console.log(req['query']);
	var name = req['query']['name'];
	var id = req['query']['id'];
	var pass = req['query']['password'];
	var timecode = req['query']['timecode'];
	var employeeType = req['query']['employeeType'];
	var workUnit = req['query']['workUnit'];
	var department = req['query']['department'];

	const hash = crypto.createHash('sha256').update(pass).digest('base64');

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  	if (err) throw err;
	  	var dbo = db.db("test");
	  	var myobj = { 
	  		name: name, 
	  		ID: id, 
	  		password: hash,
	  		timecode: timecode, 
	  		employeeType: employeeType, 
	  		workUnit: workUnit, 
	  		department: department,  
	  		schedule:[] 
	  	};
	  	dbo.collection("workerAccounts").insertOne(myobj, function(err, r) {
	  		if (err) throw err;
	  		console.log("1 document inserted");
	  		res.json({auth:"true"});
  		});
	});
})

routes.route('/managerRegister').get((req,res)=>{
	console.log(req['query']);
	var name = req['query']['name'];
	var id = req['query']['id'];
	var pass = req['query']['password'];

	const hash = crypto.createHash('sha256').update(pass).digest('base64');

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  	if (err) throw err;
	  	var dbo = db.db("test");
	  	var myobj = { 
	  		name: name, 
	  		ID: id, 
	  		password: hash
	  	};
	  	dbo.collection("managerAccounts").insertOne(myobj, function(err, r) {
	  		if (err) throw err;
	  		console.log("1 document inserted");
	  		return res.json({auth:"true"});
  		});
	});
})

//if auth = true, authenticated
//if auth = false, failed
routes.route('/workerLogIn').get((req,res)=>{
	console.log(req['query']);
	var id = req['query']['id'];
	var pass = req['query']['password'];
	const hash = crypto.createHash('sha256').update(pass).digest('base64');
	var auth = "false";
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  dbo.collection("workerAccounts").find({}).toArray(function(err, result) {
	    if (err){ 
	    	res.json({"status":"fail"});
	    	throw err;
	    	return;
	    }
	    for(var i = 0; i<result.length; i++){
	    	if(result[i]['ID']==id&&result[i]['password']==hash){
	    		auth = "true"
	    	}
	    }
	    db.close();
		res.json({auth:auth});
	  });
	});
})

routes.route('/managerLogIn').get((req,res)=>{
	console.log(req['query']);
	var id = req['query']['id'];
	var pass = req['query']['password'];
	const hash = crypto.createHash('sha256').update(pass).digest('base64');
	var auth = "false";
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  dbo.collection("managerAccounts").find({}).toArray(function(err, result) {
	    if (err){ 
	    	res.json({"status":"fail"});
	    	throw err;
	    	return;
	    }
	    for(var i = 0; i<result.length; i++){
	    	if(result[i]['ID']==id&&result[i]['password']==hash){
	    		auth = "true"
	    	}
	    }
	    db.close();
		res.json({auth:auth});
	  });
	});
})

routes.route('/managerGetTasks').get((req,res)=>{
	console.log(req['query']);
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  dbo.collection("tasks").find({}).toArray(function(err, result) {
	    if (err){ 
	    	res.json({status: 'error'});
	    	throw err;
	    }
	    res.json(result);
	    db.close();
	  });
	});
	
});

routes.route('/assignTask').get((req,res)=>{
	console.log(req['query']);
	var notes = req['query']['notes'];
	var manager = req['query']['managerID'];
	var worker = req['query']['workerID'];
	var taskID = new ObjectId(req['query']['id']);

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		var myquery = {_id:taskID};
		var newvalues = { $set: {managerAssigned: manager, workerAssigned: worker, notes: notes } };
		dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			db.close();
		});
	});
	res.json();
})

routes.route('/assignTask').get((req,res)=>{
	console.log(req['query']);
	var notes = req['query']['notes'];
	var manager = req['query']['managerID'];
	var worker = req['query']['workerID'];
	var taskID = new ObjectId(req['query']['id']);

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		var myquery = {_id:taskID};
		var newvalues = { $set: {managerAssigned: manager, workerAssigned: worker, notes: notes } };
		dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			db.close();
		});
	});
	res.json();
})

routes.route('/assignTaskAll').get((req,res)=>{
	console.log(req['query']);
	
	var notes = req['query']['notes'];
	var manager = req['query']['managerID'];
	var workers = req['query']['employees'];
	var taskID = new ObjectId(req['query']['id']);
	
	/*var taskID = new ObjectId("5e9fd90ea31e357724b78d3e");
	var manager = "ANN001";
	var workers = ['{"label":"Steve Doe","value":"STE001"}','{"label":"Bob Doe","value":"BOB002"}'];
	var notes = "notes";
	var workers = [
		{label: "name", value:"codd1"},
		{label: "name", value:"codd2"},
		{label: "name", value:"codd3"}
	]*/

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		var myquery = {_id:taskID};
		dbo.collection("tasks").find(myquery).toArray(function(err, result) {
			if (err) throw err;
			for (var i = 1; i<workers.length; i++){
				var emp = JSON.parse(workers[i]);
				var myobj = result[0];
				myobj['managerAssigned']=manager;
				myobj['notes']=notes;
				myobj['workerAssigned']=emp['value'];
				delete myobj['_id'];
				console.log(myobj)
				dbo.collection("tasks").insertOne(myobj, function(err, res) {
					if (err) throw err;
					console.log("1 doc inserted");
				});
			}
		});

		var emp = JSON.parse(workers[0]);
		var newvalues = { $set: {managerAssigned: manager, workerAssigned: emp['value'], notes: notes } };
		dbo.collection("tasks").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			console.log("1 doc updated");
			db.close();
		});
	});
	res.json();
})

routes.route('/employeeGetTasks').get((req,res)=>{
	console.log(req['query']);
	var worker = req['query']['workerID'];

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  var query = {workerAssigned: worker};
	  dbo.collection("tasks").find(query).toArray(function(err, result) {
	    if (err){ 
	    	res.json({status: 'error'});
	    	throw err;
	    }
	    return res.json(result);
	    db.close();
	  });
	});
});

routes.route('/getPossibleActivities').get((req,res)=>{
	console.log(req['query']);
	var loc = req['query']['loc'];

	let rawdata = fs.readFileSync('locationActivityCode.json');
	let data = JSON.parse(rawdata);

	return res.json(data[loc]);
});

routes.route('/completeTask').get((req,res)=>{
	console.log(req['query']);
	//fill in a new entry
	var worker = req['query']['id'];
	var d = new Date();
	var date = d.getFullYear()+" "+(d.getMonth()+1)+" "+d.getDate();

	var jobCode = req['query']['jobCode'].substring(0,6);
	var activityCode = req['query']['activityCode'].substring(0,5);
	var rate = req['query']['rate'];
	var hrs = req['query']['hrs'];
	var premiums = JSON.parse(req['query']['premiums']);
	var memo = req['query']['memo'];
	var equipment = req['query']['equipment'];

	console.log(jobCode,activityCode);
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("test");
	  var query = { id: worker, date: date};
	  //see if one already exists
	  dbo.collection("timecards").find(query).toArray(function(err, result) {
	    if (err){ 
	    	res.json({"status":"fail"});
	    	throw err;
	    	return;
	    }
	    var entries;
	    if(result.length==0){
	      //doesnt exist, add timecard
	      var myobj = { id: worker, date: date, validated: "False", flagged: "False",entries:[] };
		  dbo.collection("timecards").insertOne(myobj, function(err, res) {
		    if (err) throw err;
		    console.log("1 document inserted");
	  	  	entries = [];
	  	  	//insert entry
		    insertEntry(equipment, memo, worker, date, db, entries, jobCode, activityCode, rate, hrs, premiums);
	  	  });
	    }else{
	    	//exists, just insert entry
	    	entries = result[0]['entries'];
	    	insertEntry(equipment, memo, worker, date, db, entries, jobCode, activityCode, rate, hrs, premiums);
	    	db.close();
	    }
	  });
	});
});

function insertEntry(equipment, memo, worker, date, db, entries, jobCode, activityCode, rate, hrs, premiums){
	var dbo = db.db("test");
	var query = {id: worker, date: date};
    entries.push({
    	jobCode: jobCode,
    	activityCode: activityCode,
    	rate: rate,
    	hrs: hrs,
    	premiums: premiums,
    	memo: memo,
    	equipment: equipment
    });
	var newvalues = { $set: {entries: entries } };
	dbo.collection("timecards").updateOne(query, newvalues, function(err, res) {
	  if (err) throw err;
	  db.close();
	});
}

routes.route('/validateTimecard').get((req,res)=>{
	console.log(req['query']);
	var timecard = new ObjectId(req['query']['id']);
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		var myquery = {_id:timecard};
		var newvalues = { $set: {validated: "True"} };
		dbo.collection("timecards").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			db.close();
		});
	});
	return res.json();
});

routes.route('/getPersonInfo').get((req,res)=>{
	console.log(req['query']);
	var id = req['query']['id'];
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("workerAccounts").find({ID:id}).toArray(function(err, result) {
		    if (err){ 
		    	res.json({"status":"fail"});
		    	throw err;
		    	return;
		    }
		    if(result.length>0){
		    	result[0]['role']="employee";
		    	delete result[0]['password'];
		    	db.close();
		    	return res.json(result[0]);
		    }
		});
		dbo.collection("managerAccounts").find({ID:id}).toArray(function(err, result) {
		    if (err){ 
		    	res.json({"status":"fail"});
		    	throw err;
		    	return;
		    }
		    if(result.length>0){
		    	delete result[0]['password'];
		    	result[0]['role']="manager";
		    	db.close();
		    	return res.json(result[0]);
		    }
		});
	});
});

routes.route('/getTimecards').get((req,res)=>{
	console.log(req['query']);
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("timecards").find({}).toArray(function(err, result) {
		    if (err){ 
		    	res.json({"status":"fail"});
		    	throw err;
		    	return;
		    }
		    return res.json(result);
		});
	});
});

routes.route('/getCSV').get((req,res)=>{
	console.log(req['query']);
	var timesheetInfo = [];
	//employee name, id, type, date, hours, job code, 
	//activity code, time code, memo

	var d = new Date();
	var date = d.getFullYear()+" "+(d.getMonth()+1)+" "+d.getDate();

	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");

		dbo.collection("workerAccounts").find({}).toArray(function(err, ppl) {
			console.log(ppl);
		});
		dbo.collection("timecards").find({}).toArray(function(err, result) {
		    if (err){ 
		    	res.json({"status":"fail"});
		    	throw err;
		    	return;
		    }
		    dbo.collection("workerAccounts").find({}).toArray(function(err, ppl) {
		    	if (err){ 
			    	res.json({"status":"fail"});
			    	throw err;
			    	return;
			    }
			    console.log(ppl);
			    for(var i = 0; i<result.length; i++){
			    	var timecard = result[i];
	    			var employee = ppl[getpersonindex(timecard['id'],ppl)];
			    	for(var u = 0; u<timecard['entries'].length; u++){
			    		var entry = timecard['entries'][u];
			    		var row = {
			    			EmployeeName: employee['name'],
		    				EmployeeID: employee['ID'],
		    				EmployeeType: employee['employeeType'],
		    				Date: timecard['date'],
		    				JobCode: entry['jobCode'],
		    				ActivityCode: entry['activityCode'],
		    				Hours: entry['hrs'],
		    				Timecode: employee['timecode'],
		    				Memo: entry['memo'] 
			    		};
			    		timesheetInfo.push(row);
			    		for(var prem in entry['premiums']){
			    			row = {
				    			EmployeeName: employee['name'],
			    				EmployeeID: employee['ID'],
			    				EmployeeType: employee['employeeType'],
			    				Date: timecard['date'],
			    				JobCode: entry['jobCode'],
			    				ActivityCode: entry['activityCode'],
			    				Hours: entry['premiums'][prem],
			    				Timecode: premTimecode(employee['timecode'],prem),
			    				Memo: entry['memo'] 
				    		};
				    		timesheetInfo.push(row);
			    		}

			    	}
			    	
			    }

				return res.json(timesheetInfo);

		    });
		});
	});
});

function getpersonindex(employeeid, ppl){
	for (var i = 0; i<ppl.length; i++){
		if (ppl[i]['ID']==employeeid){
			return i;
		}
	}
}

function premTimecode(employeecode, premtype){
	console.log(employeecode,premtype);
	let rawdata = fs.readFileSync('premtimecodes.json');
	let data = JSON.parse(rawdata);
	return data[premtype][employeecode];
}

routes.route('/getAllEmployees').get((req,res)=>{
	console.log(req['query']);
	MongoClient.connect(process.env.MONGO_URL, function(err, db) {
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("workerAccounts").find({}).toArray(function(err, result) {
			res.json(result);
			db.close();
		});
	});
});

module.exports = routes;

