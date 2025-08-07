import React from "react";
import PageTitle from "../../components/common/PageTitle";

function RequestDetails() {
  return (
    <>
      <div className="px-[20px] mb-[100px] main main_page">
        <PageTitle title={"Request Details"} />
        <div className="grid grid-cols-1 grid-rows-2 gap-4 mt-5">
          <div className="w-full grid grid-cols-3 h-auto gap-4">
            <div className="bg-white rounded-lg p-6 ">
              <h2 className="text-sm font-medium">Customer Information</h2>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-sm font-medium">Service Information</h2>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-sm font-medium">Additional Instruction</h2>
            </div>
          </div>
          <div className="w-full grid grid-cols-3 h-auto gap-4">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-sm font-medium">Service Description</h2>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-sm font-medium">Other provider offering</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestDetails;
