import React, { useState } from "react";
import {
  FaSearch,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa";
import { MdDownload, MdFilterList } from "react-icons/md";
import { IoEyeSharp } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

function BookingRequest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingCategory, setBookingCategory] = useState("All");

  const itemsPerPage = 10;

  // All Booking Data
  const allBookings = [
    {
      id: 1,
      bookingId: "100114",
      location: "Customer Location",
      customerName: "Anika",
      customerPhone: "+8**********",
      amount: "2,997.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "26-Aug-2024",
      scheduleTime: "03:45am",
      bookingDate: "26-Aug-2024",
      bookingTime: "03:46pm",
      status: "Pending",
    },
    {
      id: 2,
      bookingId: "100107",
      location: "Customer Location",
      customerName: "Glory",
      customerPhone: "+8**********",
      amount: "2,980.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "16-Jul-2024",
      scheduleTime: "11:48am",
      bookingDate: "16-Jul-2024",
      bookingTime: "11:48am",
      status: "Pending",
    },
    {
      id: 3,
      bookingId: "100106",
      location: "Customer Location",
      customerName: "Glory",
      customerPhone: "+8**********",
      amount: "2,997.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "16-Jul-2024",
      scheduleTime: "11:47am",
      bookingDate: "16-Jul-2024",
      bookingTime: "11:48am",
      status: "Pending",
    },
    {
      id: 4,
      bookingId: "100102",
      location: "Customer Location",
      customerName: "Anika",
      customerPhone: "+8**********",
      amount: "2,980.00$",
      paymentStatus: "Paid",
      scheduleDate: "18-Apr-2024",
      scheduleTime: "04:00pm",
      bookingDate: "17-Apr-2024",
      bookingTime: "04:01pm",
      status: "Pending",
    },
    {
      id: 5,
      bookingId: "100100",
      location: "Customer Location",
      customerName: "Anika",
      customerPhone: "+8**********",
      amount: "8,290.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "17-Apr-2024",
      scheduleTime: "03:58am",
      bookingDate: "17-Apr-2024",
      bookingTime: "03:58pm",
      status: "Pending",
    },
    {
      id: 6,
      bookingId: "100099",
      location: "Customer Location",
      customerName: "Jemmi",
      customerPhone: "+8**********",
      amount: "7,600.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "17-Apr-2024",
      scheduleTime: "03:56am",
      bookingDate: "17-Apr-2024",
      bookingTime: "03:56pm",
      status: "Pending",
    },
    {
      id: 7,
      bookingId: "100098",
      location: "Customer Location",
      customerName: "Jemmi",
      customerPhone: "+8**********",
      amount: "11,134.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "22-Apr-2024",
      scheduleTime: "03:52pm",
      bookingDate: "17-Apr-2024",
      bookingTime: "03:54pm",
      status: "Pending",
    },
    {
      id: 8,
      bookingId: "100097",
      location: "Customer Location",
      customerName: "Jemmi",
      customerPhone: "+8**********",
      amount: "11,890.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "17-Apr-2024",
      scheduleTime: "03:27am",
      bookingDate: "17-Apr-2024",
      bookingTime: "03:27pm",
      status: "Pending",
    },
    {
      id: 9,
      bookingId: "100090",
      location: "Customer Location",
      customerName: "Anika",
      customerPhone: "+8**********",
      amount: "8,290.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "14-Mar-2024",
      scheduleTime: "03:15pm",
      bookingDate: "14-Mar-2024",
      bookingTime: "12:15pm",
      status: "Pending",
    },
    {
      id: 10,
      bookingId: "100088",
      location: "Customer Location",
      customerName: "Anika",
      customerPhone: "+8**********",
      amount: "2,240.60$",
      paymentStatus: "Unpaid",
      scheduleDate: "14-Mar-2024",
      scheduleTime: "03:14pm",
      bookingDate: "14-Mar-2024",
      bookingTime: "12:15pm",
      status: "Pending",
    },
  ];

  // Dummy data for Regular Bookings
  const regularBookings = [
    {
      id: 11,
      bookingId: "100120",
      location: "Office",
      customerName: "Lucas",
      customerPhone: "+1**********",
      amount: "3,000.00$",
      paymentStatus: "Paid",
      scheduleDate: "10-Jul-2024",
      scheduleTime: "10:00am",
      bookingDate: "09-Jul-2024",
      bookingTime: "01:00pm",
      status: "Confirmed",
    },
  ];

  // Dummy data for Repeat Bookings
  const repeatBookings = [
    {
      id: 12,
      bookingId: "100121",
      location: "Customer Location",
      customerName: "Sophia",
      customerPhone: "+1**********",
      amount: "4,500.00$",
      paymentStatus: "Unpaid",
      scheduleDate: "12-Jul-2024",
      scheduleTime: "02:00pm",
      bookingDate: "10-Jul-2024",
      bookingTime: "03:00pm",
      status: "Pending",
    },
  ];

  // Combine data based on category
  const bookingData =
    bookingCategory === "All"
      ? allBookings
      : bookingCategory === "Regular"
      ? regularBookings
      : repeatBookings;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookingData.length / itemsPerPage);

  const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages <= 3) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pageNumbers = getPaginationRange(currentPage, totalPages);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (category) => {
    setBookingCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="px-[20px] mb-[100px] main main_page">
      <h1 className="py-[20px] font-[600] text-[20px]">Booking Request</h1>

      <div className="flex justify-end text-[14px] text-[#979797] font-medium">
        Total Request:{" "}
        <span className="text-[14px] text-[black] ml-1">
          {bookingData.length}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-2">
        {["All", "Regular", "Repeat"].map((type) => (
          <div
            key={type}
            className={`flex justify-center items-center px-[10px] py-[5px] text-[14px] rounded-lg cursor-pointer ${
              bookingCategory === type
                ? "bg-blue-500 text-white"
                : "text-[#1a1a1a] hover:bg-blue-500 hover:text-white"
            }`}
            onClick={() => handleCategoryChange(type)}
          >
            {type} Booking
          </div>
        ))}
      </div>

      <div className="w-[100%] h-auto p-2 mt-2 bg-white rounded-lg">
        {/* Search + Filter */}
        <div className="flex justify-between w-[100%] h-auto">
          <form action="" className="flex gap-1">
            <div className="relative flex gap-2 px-3 bg-blue-50">
              <FaSearch className="absolute opacity-40 top-3" size={15} />
              <input
                type="search"
                placeholder="Search here"
                className="ml-6 text-[14px] outline-none "
              />
            </div>
            <button
              type="submit"
              className="px-[15px] py-[8px] text-[14px] bg-blue-500 rounded text-white cursor-pointer"
            >
              Search
            </button>
          </form>
          <div className="flex gap-2">
            <div className="flex gap-1 justify-center items-center rounded px-3 bg-[#E0E0E0]">
              <MdDownload />
              <span className="text-[14px]">Download</span>
              <FaCaretDown />
            </div>
            <div className="flex gap-2 justify-center items-center rounded px-4 border-[1px]">
              <MdFilterList />
              <span className="text-[14px]">Filter</span>
              <span className="text-[14px]">0</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="mt-[10px] w-full overflow-x-scroll">
          <thead className="bg-blue-50">
            <tr className="text-gray-700">
              {[
                "SL",
                "Booking ID",
                "Where Service will be Provided",
                "Customer Info",
                "Total Amount",
                "Payment Status",
                "Schedule Date",
                "Booking Date",
                "Status",
                "Action",
              ].map((head) => (
                <th key={head} className="text-[14px] px-4 py-2 text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td className="text-[14px] px-4 py-2">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="text-[14px] px-4 py-2">{item.bookingId}</td>
                <td className="text-[14px] px-4 py-2">{item.location}</td>
                <td className="text-[14px] px-4 py-2">
                  <div>{item.customerName}</div>
                  <div>{item.customerPhone}</div>
                </td>
                <td className="text-[14px] px-4 py-2">{item.amount}</td>
                <td className="text-[14px] px-4 py-2">
                  <div
                    className={`rounded px-2 py-1 ${
                      item.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {item.paymentStatus}
                  </div>
                </td>
                <td className="text-[14px] px-4 py-2">
                  <div>{item.scheduleDate}</div>
                  <div>{item.scheduleTime}</div>
                </td>
                <td className="text-[14px] px-4 py-2">
                  <div>{item.bookingDate}</div>
                  <div>{item.bookingTime}</div>
                </td>
                <td className="text-[14px] px-4 py-2">
                  <div className="bg-green-100 text-green-500 rounded px-2 py-1">
                    {item.status}
                  </div>
                </td>
                <td className="flex items-center gap-2 px-4 py-2">
                  <ActionButton icon={<IoEyeSharp />} border="blue" />
                  <ActionButton icon={<MdDownload />} border="blue" />
                  <ActionButton icon={<TiTick />} border="green" />
                  <ActionButton icon={<RxCross2 />} border="red" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end gap-2 text-[14px] px-4 py-2">
          <PaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            icon={<FaCaretLeft />}
          />
          {pageNumbers.map((page) => (
            <PaginationButton
              key={page}
              onClick={() => handlePageChange(page)}
              active={currentPage === page}
              label={page}
            />
          ))}
          <PaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            icon={<FaCaretRight />}
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Button Components
const ActionButton = ({ icon, border }) => (
  <div
    className={`flex justify-center items-center w-[25px] h-[25px] border border-${border}-500 rounded`}
  >
    <span className={`text-${border}-500 text-[15px]`}>{icon}</span>
  </div>
);

const PaginationButton = ({ onClick, icon, label, active }) => (
  <div
    onClick={onClick}
    className={`flex justify-center items-center w-[25px] h-[25px] rounded cursor-pointer ${
      active ? "bg-blue-500 text-white" : "bg-black text-white"
    }`}
  >
    {icon || label}
  </div>
);

export default BookingRequest;
