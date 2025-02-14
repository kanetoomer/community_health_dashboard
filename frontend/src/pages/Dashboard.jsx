import { useState } from "react";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// Pages
import FileUpload from "../components/FileUpload.jsx";
import DataTable from "../components/DataTable.jsx";
import DataChart from "../components/DataChart.jsx";
import ReportGenerator from "../components/ReportGenerator.jsx";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  TableCellsIcon,
  ArrowLeftStartOnRectangleIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  ArrowUpOnSquareStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "File Upload", href: "/", icon: ArrowUpOnSquareStackIcon },
  { name: "Data Table", href: "/table", icon: TableCellsIcon },
  { name: "Data Charts", href: "/charts", icon: ChartPieIcon },
  { name: "Generate Reports", href: "/reports", icon: DocumentDuplicateIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard({ url }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center font-bold text-indigo-800">
                  <h1>Community Health Dashboard</h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.href}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                )
                              }
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              />
                              {item.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        <ArrowLeftStartOnRectangleIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                        />
                        Logout
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center font-bold text-indigo-800">
              <h1>Community Health Dashboard</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            )
                          }
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                          />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                    <ArrowLeftStartOnRectangleIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                    />
                    Logout
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                {/* ROUTES */}
                <Route path="/" element={<FileUpload />} />
                <Route path="/table" element={<DataTable />} />
                <Route path="/charts" element={<DataChart />} />
                <Route path="/reports" element={<ReportGenerator />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
