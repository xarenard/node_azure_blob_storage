/*jshint expr: true*/

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var expect = require("chai").expect;
var assert = require("chai").assert;
var azure_utils = require("../../app/lib/azure_blob_storage");
var nconf = require('nconf');

const TEST_FOLDER = path.join(__dirname, "..");
const BLOB_FILE_NAME = 'shakespeare.txt';
const BLOB_UPLOAD_DIR_PATH = path.join(TEST_FOLDER, "upload");
const BLOB_DOWNLOAD_DIR_PATH = path.join(TEST_FOLDER, "download");
const BLOB_FILE_PATH = path.join(BLOB_UPLOAD_DIR_PATH, BLOB_FILE_NAME);
const AZURE_CONTAINER_NAME = crypto.randomBytes(5).toString('hex');
const AZURE_CONFIG_DIR_PATH= path.join(TEST_FOLDER,"config");

// Azure accesskey and storage account
nconf.argv().env().file({file: path.join(AZURE_CONFIG_DIR_PATH, "config.json")});
const ACCESS_KEY = nconf.get("AZURE_STORAGE_ACCESS_KEY");
const STORAGE_ACCOUNT = nconf.get("AZURE_STORAGE_ACCOUNT");

describe("Azure Blob Storage Test", function () {

    var azureBlobService = null;

    describe("Creating Azure blob Service ", function () {
        beforeEach(function () {
            azureBlobService = azure_utils.blobService(STORAGE_ACCOUNT, ACCESS_KEY);
        });

        it("Blob service should not be null", function () {
            expect(azureBlobService).not.to.be.null;
        });

        describe("Creating Azure container".concat(":", AZURE_CONTAINER_NAME), function () {

            it("Container creation should succeed", function (done) {
                azure_utils.createContainerIfNotExists(azureBlobService, AZURE_CONTAINER_NAME, function (err, result) {
                    expect(err).to.be.null;
                    assert.equal(result.status, azure_utils.RESULT_STATUS_SUCCESS);
                    done();
                });
            });
            describe("CRUD Blob storage", function () {
                describe("Listing blobs", function () {
                    it("should return no entries", function (done) {
                        azure_utils.listBlobs(azureBlobService, AZURE_CONTAINER_NAME, function (err, result) {
                            assert.equal(0, result.numEntries, "There should be 0 blobs");
                            done();
                        });
                    });
                });

                describe("Uploading file", function () {
                    it("should succeed", function (done) {
                        var stats = fs.statSync(BLOB_FILE_PATH);
                        var fileSizeInBytes = stats.size;
                        var readStream = fs.createReadStream(BLOB_FILE_PATH);
                        azure_utils.uploadBlobFromStream(azureBlobService, AZURE_CONTAINER_NAME, BLOB_FILE_NAME, readStream, fileSizeInBytes, function (err, result) {
                            expect(err).to.be.null;
                            assert.equal(result.status,azure_utils.RESULT_STATUS_SUCCESS);
                            done();
                        });
                    });
                });

                describe("Listing blobs", function () {
                    it("should return one entry", function (done) {
                        azure_utils.listBlobs(azureBlobService, AZURE_CONTAINER_NAME, function (err, result) {
                            expect(err).to.be.null;
                            assert.equal(result.status,azure_utils.RESULT_STATUS_SUCCESS);
                            assert.isAtLeast(1, result.numEntries, "There should be at least 1 blob");
                            done();
                        });
                    });
                });

                describe("Downloading existing blob", function () {
                    it("should succeed", function (done) {
                        var downloadFileName = path.join(BLOB_DOWNLOAD_DIR_PATH, BLOB_FILE_NAME);
                        var writeStream = fs.createWriteStream(downloadFileName);
                        var stats = fs.statSync(BLOB_DOWNLOAD_DIR_PATH);
                        azure_utils.downloadBlob(azureBlobService, AZURE_CONTAINER_NAME, BLOB_FILE_NAME, writeStream, null, function (err, result) {
                            assert.equal(result.status,azure_utils.RESULT_STATUS_SUCCESS);
                            done();
                        });
                    });
                });

                describe("Deleting existing blob", function () {
                    it("should succeed", function (done) {
                        azure_utils.deleteBlob(azureBlobService, AZURE_CONTAINER_NAME, BLOB_FILE_NAME, null, function (err, result) {
                            done();
                        });
                    });
                });

                describe("Listing blobs", function () {
                    it("should return no entries", function (done) {
                        azure_utils.listBlobs(azureBlobService, AZURE_CONTAINER_NAME, function (err, result) {
                            assert.equal(0, result.numEntries, "There should be 0 blobs");
                            done();
                        });
                    });
                });
            });
        });

        describe("Deleting container".concat(":",AZURE_CONTAINER_NAME), function () {
            it("Deletion should succeed", function (done) {
                azure_utils.deleteContainerIfExists(azureBlobService, AZURE_CONTAINER_NAME, function (err, result) {
                    expect(err).to.be.null;
                    done();
                });
            });
        });
    });
});
