var azure = require("azure-storage");

var azureBlobStorage = (function AzureBlobStorage() {

    const RESULT_STATUS_SUCCESS = "SUCCESS";
    const RESULT_STATUS_FAILED = "FAILED";

    var _handleAzureCall = function (err, callback, response) {
        var result = {response: response};

        if (err) {
            result.status = RESULT_STATUS_FAILED;
            result.msg = err.message;
        }
        else {
            result.status = RESULT_STATUS_SUCCESS;
        }
        callback(err, result);
    };

    var blobService = function (storageAccount, credential) {
        return (credential !== null) ? azure.createBlobService(storageAccount, credential) : azure.createBlobService(storageAccount);
        //return azure.createBlobService(storageAccount, credential);
    };

    var createContainerIfNotExists = function (blobService, container, callback) {
        blobService.createContainerIfNotExists(container, function (err, options, response) {
            _handleAzureCall(err, callback, response);
        });
    };

    var deleteContainerIfExists = function (blobService, container, callback) {
        blobService.deleteContainerIfExists(container, null, function (err, deleteResponse) {
            _handleAzureCall(err, callback, deleteResponse);
        });
    };

    var uploadBlobFromStream = function (azureBlobService, container, fileName, stream, streamLength, callback) {
        azureBlobService.createBlockBlobFromStream(container, fileName, stream, streamLength, null, function (error, response) {
            _handleAzureCall(error, callback, response);
        });
    };

    var downloadBlob = function (azureBlobService, container, blob, writeStream, optionsOrCallback, callback) {
        azureBlobService.getBlobToStream(container, blob, writeStream, optionsOrCallback, function (error, responseBlob, response) {
            _handleAzureCall(error, callback, response);
        });
    };

    var deleteBlob = function (azureBlobService, container, blob, optionsOrCallback, callback) {
        azureBlobService.deleteBlob(container, blob, optionsOrCallback, function (error, deleteResponse) {
            _handleAzureCall(error, callback, deleteResponse);
        });
    };

    var listBlobs = function (blobService, container, callback) {
        blobService.listBlobsSegmented(container, null, function (err, response) {
            var listResult = {response: response, numEntries: 0};

            if (err) {
                listResult.status = RESULT_STATUS_FAILED;
                listResult.msg = err.message;
            }
            else {
                listResult.status = RESULT_STATUS_SUCCESS;
                listResult.numEntries = response.entries.length;
            }
            callback(null, listResult);
        });
    };

    return {
        RESULT_STATUS_FAILED:RESULT_STATUS_FAILED,
        RESULT_STATUS_SUCCESS:RESULT_STATUS_SUCCESS,
        createContainerIfNotExists: createContainerIfNotExists,
        listBlobs: listBlobs,
        blobService: blobService,
        deleteContainerIfExists: deleteContainerIfExists,
        uploadBlobFromStream: uploadBlobFromStream,
        deleteBlob: deleteBlob,
        downloadBlob: downloadBlob
    };
})();

module.exports = azureBlobStorage;