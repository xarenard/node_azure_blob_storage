# node_azure_blob_storage

Simple example of using Azure blob Storage with node.js and testing CRUD operations with Mocha framework.
The output should look similar to this:

```
Azure Blob Storage Test
    Creating Azure blob Service 
      ✓ Blob service should not be null
      Creating Azure container:57711d6b9d
        ✓ Container creation should succeed (1246ms)
        CRUD Blob storage
          Listing blobs
            ✓ should return no entries (690ms)
          Uploading file
            ✓ should succeed (591ms)
          Listing blobs
            ✓ should return one entry (574ms)
          Downloading existing blob
            ✓ should succeed (1140ms)
          Deleting existing blob
            ✓ should succeed (559ms)
          Listing blobs
            ✓ should return no entries (553ms)
      Deleting container:57711d6b9d
        ✓ Deletion should succeed (1132ms)

```

## Requirements

- nodejs >= 4.3.1
- npm 1.4.21

## Usage

In order to run the script, just execute npm test 

```bash
user@home:~/projects/node_azure_blob_storage$npm install
user@home:~/projects/node_azure_blob_storage$npm test
```

Both Azure storage access key and storage account have to be defined either by setting environment variables or by editing the configuration file (config.json)

### Environment variables

```bash
export AZURE_STORAGE_ACCESS_KEY=MYKEYLZ/PyfMDDl0psML2uyVfDs6MTsbkb7uWD9HKFiZfJ1pi2nCT0YQQZ94SMBTmbk09kl78MoTvDez6QO4A==
export AZURE_STORAGE_ACCOUNT=mystorage
```


### Configuration file

Edit config/config.json and set both AZURE_STORAGE_ACCESS_KEY and AZURE_STORAGE_ACCOUNT




