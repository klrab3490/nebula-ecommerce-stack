"use client";
import { UploadButton } from "@/utils/uploadthing";
function Admin() {
  return (
    <div>
      <h1>Hello World!</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
          const uploadedUrl = res[0].ufsUrl;
          alert(`File URL: ${uploadedUrl}`);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}

export default Admin;
