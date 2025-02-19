// Dashboard.jsx
import React from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import FileUpload from "../components/FileUpload";
import { useAuth } from "../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // If no user is found (user is not logged in), redirect to sign-in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Navigation links for desktop and mobile
  const navigation = [{ name: "File Upload", href: "/dashboard" }];
  const userNavigation = [
    {
      name: "Sign out",
      onClick: () => {
        signOut();
        navigate("/", { replace: true });
      },
    },
  ];

  return (
    <div className="min-h-full">
      {/* Navigation Bar */}
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side: Navigation links */}
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            {/* Right side: User dropdown */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <div className="text-base font-medium text-white">
                        {user.name}
                      </div>
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <Disclosure.Button className="group inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  className="block h-6 w-6 group-data-[open]:hidden"
                  aria-hidden="true"
                />
                <XMarkIcon
                  className="hidden h-6 w-6 group-data-[open]:block"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <Disclosure.Panel className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
              <Disclosure.Button
                key={item.name}
                as={NavLink}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )
                }
              >
                {item.name}
              </Disclosure.Button>
            ))}
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center">
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user.name}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              {userNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="button"
                  onClick={item.onClick}
                  className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </div>
        </Disclosure.Panel>
      </Disclosure>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Community Health Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <FileUpload />
        </div>
      </main>
    </div>
  );
}
