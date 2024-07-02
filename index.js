const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let patients = new Object();
patients["555864556"] = ["Jenson", "Watkins", "425-555-1234"]
patients["555458896"] = ["Patrick", "Johnson", "425-555-5678"]

let records = new Object();
records["555864556"] = "Status = Healthy"
records["555458896"] = "Status = Slight Cold"

// Get patient medical records route
app.get("/records", (req, res) => {

    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg": "Patient not found."})
        return;
    }

    // Verify SSN matches
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        // First, last, and ssn match
        if (req.body.reasonforvisit === "medicalrecords") {
            // Return medical records
            res.status(200).send(records[req.headers.ssn]);
            return;
        }
        else {
            // Return error
            res.status(501).send({"msg": "Unable to complete request at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else {
        res.status(401).send({"msg": "First or last name did not match given SSN."})
        return;
    }

});

// Create a new patient route
app.post("/", (req, res) => {
    // Create patient in database (minus checks)
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phone]
    res.status(200).send(patients)
});

// Update existing patient phone number route
app.put("/", (req, res) => {
    // Verify patient exists
    if (records[req.headers.ssn] === undefined) {
        res.status(404).send({"msg": "Patient not found."})
        return;
    }

    // Verify SSN matches
    if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
        // Update phone number and return patient info
        patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phone];
        res.status(200).send(patients[req.headers.ssn]);
        return;
    }
    else {
        res.status(401).send({"msg": "First or last name did not match given SSN."})
        return;
    }

    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})
});

// Delete patient records route
app.delete("/", (req, res) => {
        // Verify patient exists
        if (records[req.headers.ssn] === undefined) {
            res.status(404).send({"msg": "Patient not found."})
            return;
        }
    
        // Verify SSN matches
        if (req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]) {
            // Delete patient and medical records from database
            delete patients[req.headers.ssn]
            delete records[req.headers.ssn]

            res.status(200).send({"msg": "Successfully deleted."})
            return;
        }
        else {
            res.status(401).send({"msg": "First or last name did not match given SSN."})
            return;
        }
});

app.listen(3000);
