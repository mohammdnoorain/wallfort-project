const { BlobServiceClient } = require('@azure/storage-blob');

async function deleteImageFromAzure(blobId) {
   const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(`/crm-imgs/${blobId}`); 
   const deleteResponse= await blockBlobClient.delete(); 
    return deleteResponse; 
}


async function uploadImageToAzure(imageBuffer,blobId) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(`/crm-imgs/${blobId}`); 
    await blockBlobClient.uploadData(imageBuffer,{overwrite:true}); 
    return blockBlobClient.url; 
}


module.exports={
deleteImageFromAzure,
uploadImageToAzure,
}
