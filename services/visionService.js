require('dotenv').config();

const vision = require('@google-cloud/vision');

// Load Sugar model
const Sugar = require('../models/Sugars');

const SUGARS_DB = ['sugar','dextrose','fructose','galactose','glucose','lactose','maltose',
                'sucrose','demerara','syrup','rapadura','dextrin','diastatic malt','maltol',
                'muscovado','panela','maltodextrin','turbinado','sucanat','molasses','agave',
                'high fructose','hfcs','honey','treacle','buttercream','caramel', 'juice concentrate'];

function filterSugars(arr, query) {
    return arr.filter(function(el) {
        return el.toLowerCase().indexOf(query.toLowerCase()) !== -1
    })
};

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        if (elem.includes("ingredients") == false) {
            _union.add(elem)
        }
    }
    return _union
};

const extractLabel = async (req, res) => {
    try {
        let img_path = req
        if(img_path) {
            // Create a client
            const client = new vision.ImageAnnotatorClient(credentials=process.env.GOOGLE_APPLICATION_CREDENTIALS);

            console.log("GCP client connected")
            // Performs text detection on the local file
            const [result] = await client.textDetection(img_path);
            const detections = result.textAnnotations;
            if (detections.length != 0){
                let label = detections.shift().description;
                if(label) {
                    return label
                }
            }
        }
        return null
    } catch (error) {
        console.log(error);
    }
};

const extractSugars = (req, res) => {
    if(req.label) {
        var sugarsData = {
            productName: req.productName,
            userID: req.userID
        }
        console.log("Extracting sugars")
        let label = req.label.replace(/\n/g, " "); // replace new line char with space
        let ingredients = []
        let words = label.split(/[,,.,:,(,),\[,\]]/);
        words.forEach((s) => {
            s = s.replace(/[^a-zA-Z\s]/g, ""); //remove non alpha characters
            s = s.trim() //remove trailing/starting whitespace
            s = s.toLowerCase() //convert to lowercase
            ingredients.push(s)
        });
        // split label string to list of words and trim whitespace
        var allSugars = new Set();
        SUGARS_DB.forEach((sugar) => {
            let filtered = filterSugars(ingredients, sugar);
            let matched = new Set(filtered);
            allSugars = union(allSugars, matched);
        });
        let sugarsList = Array.from(allSugars);
        if (sugarsList.length != 0) {
            sugarsData['sugars'] = sugarsList;
        }
        else {
            sugarsData['sugars'] = ["No sugars detected"];
        }

        saveSugars(sugarsData)

    }
    else {
        res.json({
            statusCode: 400,
            message: "Failed: Cannot extract sugars from label"
        });
    };
};

const saveSugars = (sugarsData) => {
    Sugar.create(sugarsData, (err, result) => {
        if(result) {
            console.log("Sugars saved", result._id);
        }
    });
}

module.exports = {
    extractLabel, extractSugars
}
