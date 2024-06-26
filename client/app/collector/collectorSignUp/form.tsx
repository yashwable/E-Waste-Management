"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
// import loader from "../../utils/googleMapsLoader";
// import {} from "googlemaps";

export default function Form({
  changeParentState,
  setEmail,
}: {
  changeParentState: (newState: string) => void;
  setEmail: (email: string) => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(
    new Array(12).fill(false) as Array<boolean>
  );

  const [checked1, setChecked1] = useState(
    new Array(5).fill(false) as Array<boolean>
  );

  const [data, setData] = useState({
    centerName: "",
    contactPerson: "",
    email: "",
    state: "",
    city: "",
    district: "",
    subDistrict: "",
    phoneNumber: "",
    timeFrom: "",
    timeTo: "",
    acceptedItems: "",
    serviceOffered: "",
    password: "",
    confirmPassword: "",
  });

  const acceptedItems = [
    {
      id: 1,
      name: "Computers & Peripherals",
      description: "PCs, laptops, monitors, keyboards, mice, etc.",
      selected: true,
    },
    {
      id: 2,
      name: "Mobile Devices",
      description: "Smartphones, tablets, chargers, cases, etc.",
      selected: true,
    },
    {
      id: 3,
      name: "Consumer Electronics",
      description: "Cameras, audio devices, gaming consoles, etc.",
      selected: true,
    },
    {
      id: 4,
      name: "Home Appliances",
      description: "Refrigerators, washing machines, microwaves, etc.",
      selected: true,
    },
    {
      id: 5,
      name: "Batteries",
      description: "Rechargeable, button batteries, etc.",
      selected: true,
    },
    {
      id: 6,
      name: "Cables & Wires",
      description: "Chargers, USB cables, etc.",
      selected: true,
    },
    {
      id: 7,
      name: "Printers & Cartridges",
      description: "Printers, ink, toner cartridges, etc.",
      selected: true,
    },
    {
      id: 8,
      name: "Electronic Components",
      description: "Circuit boards, processors, RAM, etc.",
      selected: true,
    },
    {
      id: 9,
      name: "Small Appliances",
      description: "Toasters, blenders, coffee makers, etc.",
      selected: true,
    },
    {
      id: 10,
      name: "Lighting Equipment",
      description: "Bulbs, fluorescent lights, LEDs, etc.",
      selected: true,
    },
    {
      id: 11,
      name: "Medical Devices",
      description: "Electronic medical instruments.",
      selected: true,
    },
    {
      id: 12,
      name: "Gaming Consoles",
      description: "Game consoles and accessories.",
      selected: true,
    },
  ];

  const servicesOffered = [
    {
      id: 1,
      name: "Pick-up service",
      description:
        "The e-waste collector center will collect the e-waste from the customer’s location and transport it to their facility.",
    },
    {
      id: 2,
      name: "Drop-off service",
      description:
        "The customer can drop off the e-waste at the e-waste collector center’s facility or at designated collection points.",
    },
    {
      id: 3,
      name: "Data destruction service",
      description:
        "The e-waste collector center will erase or destroy the data stored in the e-waste devices to prevent any unauthorized access or misuse.",
    },
    {
      id: 4,
      name: "Refurbishment service",
      description:
        "The e-waste collector center will repair, upgrade, or restore the e-waste devices that are still functional or have some salvageable parts.",
    },
    {
      id: 5,
      name: "Recycling service",
      description:
        "The e-waste collector center will dismantle, separate, and recover the valuable materials from the e-waste devices that are non-functional or beyond repair.",
    },
  ];

  const handleSubmits = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const address = encodeURIComponent(
      `${data.city}, ${data.subDistrict}, ${data.district}, ${data.state}`
    );

    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.NEXT_PUBLIC_HERE_MAP_API_KEY}`
    );

    if (!Array.isArray(res.data.items) || res.data.items.length === 0) {
      toast.error("Invalid address", {
        position: "bottom-right",
      });
      return;
    }

    // console.log(res.data.items[0].position);
    // console.log(res);

    if (data.password !== data.confirmPassword) {
      toast.error("Password does not match", {
        position: "bottom-right",
      });
      return;
    }

    if (!file) {
      toast.error("Please upload a photo", {
        position: "bottom-right",
      });
      return;
    }

    const items = [];

    for (let i = 0; i < checked.length; i++) {
      if (checked[i]) {
        items.push(acceptedItems[i].name);
      }
    }

    const services = [];
    for (let i = 0; i < checked1.length; i++) {
      if (checked1[i]) {
        services.push(servicesOffered[i].name);
      }
    }

    const formData = new FormData();

    formData.append("photo", file!);
    formData.append("centerName", data.centerName);
    formData.append("contactPerson", data.contactPerson);
    formData.append("email", data.email);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("district", data.district);
    formData.append("subDistrict", data.subDistrict);
    formData.append("phone", data.phoneNumber);
    formData.append("longitude", res.data.items[0].position.lng);
    formData.append("latitude", res.data.items[0].position.lat);
    formData.append("timeFrom", data.timeFrom);
    formData.append("timeTo", data.timeTo);
    formData.append("acceptedItems", JSON.stringify(items));
    formData.append("serviceOffered", JSON.stringify(services));
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/api/collectorAuth/signup`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res);
          console.log("success");
          toast.success("Successfully Registered", {
            position: "bottom-right",
          });
          setEmail(data.email);
          changeParentState("otp");
        })
        .catch((error) => {
          console.log(error);
          toast.error(`${error.response.data.message}`, {
            position: "bottom-right",
          });
        });
    } catch (error: any) {
      console.log("error", error);
      toast.error(`${error.response.data.message}`, {
        position: "bottom-right",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setFile(file);

    if (file) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageUrl(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData({ ...data, [name]: value });
  };

  const handleCheckboxChange = (position: Number) => {
    const updatedCheckedState = checked.map((item, index) => {
      if (index === position) {
        return !item;
      }
      return item;
    });

    setChecked(updatedCheckedState);
  };

  const handleCheckboxChange1 = (position: Number) => {
    const updatedCheckedState = checked1.map((item, index) => {
      if (index === position) {
        return !item;
      }
      return item;
    });

    setChecked1(updatedCheckedState);
  };

  return (
    <>
      <form
        className="mt-8 w-full max-w-3xl justify-center px-8 space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmits}
      >
        <div className="rounded-md shadow-sm border-b space-y-12 border-gray-900/10 pb-12 px-20 py-30">
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              {imageUrl && (
                <img
                  loading="lazy"
                  className="h-16 w-16 object-cover rounded-full"
                  src={imageUrl}
                  alt="Current profile photo"
                  key={imageUrl}
                />
              )}
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100
                            "
              />
            </label>
          </div>
          {/* // center name input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="centerName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Center Name
              </label>
              <div className="mt-2">
                <input
                  id="centerName"
                  name="centerName"
                  value={data.centerName}
                  onChange={handleChange}
                  type="text"
                  autoComplete="centerName"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // username input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="contactPerson"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Contact Person
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    e-waste.com/
                  </span>
                  <input
                    type="text"
                    name="contactPerson"
                    value={data.contactPerson}
                    onChange={handleChange}
                    id="contactPerson"
                    autoComplete="contactPerson"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="jane smith"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* // email input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  type="email"
                  autoComplete="email"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // state input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="state"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                state
              </label>
              <div className="mt-2">
                <input
                  id="state"
                  name="state"
                  value={data.state}
                  onChange={handleChange}
                  type="text"
                  autoComplete="state"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // district input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="district"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                district
              </label>
              <div className="mt-2">
                <input
                  id="district"
                  name="district"
                  value={data.district}
                  onChange={handleChange}
                  type="text"
                  autoComplete="district"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // subDistrict input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="subDistrict"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                subDistrict
              </label>
              <div className="mt-2">
                <input
                  id="subDistrict"
                  name="subDistrict"
                  value={data.subDistrict}
                  onChange={handleChange}
                  type="text"
                  autoComplete="subDistrict"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // city input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                city
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  value={data.city}
                  onChange={handleChange}
                  type="text"
                  autoComplete="city"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // phone number input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleChange}
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="1234567890"
                  autoComplete="phoneNumber"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // operating hours input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              {/* <label
                    htmlFor="operatingHours"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  > */}
              <h1>Operating Hours</h1>
              {/* </label> */}
              <div className="mt-2">
                <label htmlFor="from">From:</label>
                <input
                  type="time"
                  name="timeFrom"
                  value={data.timeFrom}
                  onChange={handleChange}
                  id="from"
                />
                <label htmlFor="to">To:</label>
                <input
                  type="time"
                  name="timeTo"
                  value={data.timeTo}
                  onChange={handleChange}
                  id="to"
                />
              </div>
            </div>
          </div>
          {/* // accepted items input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <h1>
                <label
                  htmlFor="acceptedItems"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Accepted Items
                </label>
              </h1>
              {acceptedItems.map((item, index) => (
                <div key={index} className="mt-2">
                  <input
                    type="checkbox"
                    id={`acceptedItems${index}`}
                    name={item.name}
                    value={item.name}
                    checked={checked[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label htmlFor={item.name}>{` ${item.name}`}</label>
                </div>
              ))}
            </div>
          </div>
          {/* // service offered input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="serviceOffered"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Service Offered
              </label>
              {servicesOffered.map((item, index) => (
                <div key={index} className="mt-2">
                  <input
                    type="checkbox"
                    id={`serviceOffered${index}`}
                    name={item.name}
                    value={item.name}
                    checked={checked1[index]}
                    onChange={() => handleCheckboxChange1(index)}
                  />
                  <label htmlFor={item.name}>{` ${item.name}`}</label>
                </div>
              ))}
            </div>
          </div>
          {/* // password input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  type="password"
                  autoComplete="password"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          {/* // confirm password input field */}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  type="password"
                  autoComplete="password"
                  className="pl-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
