let Service = require("../services");

const getUserSugars = async (req, res) => {
    try {
        if (req) {
            let result = await Service.sugarsService.getAllSugars(req);
            if(result) {
                res.json({
                    statusCode:200,
                    data: result,
                    message: "Sucess: retrieved all results for user"
                });
            }
            else {
                res.json({
                    statusCode:400,
                    message: "Failed: could not retrieve results for user"
                });
            }
        }
        else {
            res.json({
                statusCode: 400,
                message: "Failed: No userID"
            });
        }
    } catch (error) {
        console.log(error)
    }
};

const updateProduct= async (req, res) => {
    try {
        if (req) {
            let result = await Service.sugarsService.updateProductName(req);
            if(result) {
                res.json({
                    statusCode:200,
                    data: result,
                    message: "Sucess: product name updated"
                });
            }
            else {
                res.json({
                    statusCode:400,
                    message: "Failed: could not update product name"
                });
            }
        }
        else {
            res.json({
                statusCode: 400,
                message: "Failed: No product ID or name provided"
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (req) {
            let result = await Service.sugarsService.deleteByID(req);
            if(result) {
                res.json({
                    statusCode:200,
                    data: result,
                    message: "Sucess: product deleted"
                });
            }
            else {
                res.json({
                    statusCode:400,
                    message: "Failed: could not delete product"
                });
            }
        }
        else {
            res.json({
                statusCode: 400,
                message: "Failed: No product ID provided"
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const getUserResult = async (req, res) => {
    try {
        if (req) {
            let result = await Service.sugarsService.getLatestSugar(req);
            if(result) {
                res.json({
                    statusCode:200,
                    data: result,
                    message: "Sucess: retrieved latest sugar for user"
                });
            }
            else {
                res.json({
                    statusCode:400,
                    message: "Failed: could not retrieve result for user"
                });
            }
        }
        else {
            res.json({
                statusCode: 400,
                message: "Failed: No userID"
            });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getUserSugars, getUserResult, updateProduct, deleteProduct
}
