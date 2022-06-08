const Sugar = require('../models/Sugars');

const getAllSugars = async (req, res) => {
    try {
        let userID = req;
        let sugars = await Sugar.find({userID: userID}).sort({date: -1}).exec();
        return sugars
    } catch (error) {
        console.log(error);
    }
};

const getLatestSugar = async (req, res) => {
    try {
        let userID = req;
        let sugars = await Sugar.findOne({userID: userID}).sort({date: -1}).exec();
        return sugars
    } catch (error) {
        console.log(error);
    }
};

const updateProductName = async (req, res) => {
    try {
        let objID = req.objID;
        let newName = req.newName;
        let updated = await Sugar.updateOne({_id: objID},{productName:newName}).exec();
        console.log("Product name updated");
        return updated
    } catch (error) {
        console.log(error);
    }
};

const deleteByID = async (req, res) => {
    try {
        let objID = req;
        let deleted = await Sugar.deleteOne({_id: objID}).exec();
        console.log("Product deleted");
        return deleted
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllSugars, getLatestSugar, updateProductName, deleteByID
}
