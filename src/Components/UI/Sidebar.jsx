import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineSettings,
  MdOutlinePerson,
  MdOutlineListAlt,
  MdOutlineQueryBuilder,
  MdOutlineFactCheck,
} from "react-icons/md";
import { AiOutlineBranches, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaAngleDown, FaSignOutAlt, FaPhoneAlt } from "react-icons/fa";
import logo from "../../Assets/logo.jpeg";
// import { useAuth } from "../context/AuthProvider";

const  Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { user, setLogin } = useAuth();

  const [activeButton, setActiveButton] = useState(
    localStorage.getItem("activeButton") || "Dashboard"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <MdOutlineDashboard /> },
    { name: "Tailors", href: "/user", icon: <AiOutlineUsergroupAdd /> },
    {
      name: "Industries",
      href: "#",
      icon: <AiOutlineBranches />,
      subItems: [
        { name: "Industries List", href: "/client", icon: <MdOutlineListAlt /> },
        { name: "Branches", href: "/branches", icon: <AiOutlineBranches /> },
      ],
    },
    { name: "Order Project", href: "/order-project", icon: <MdOutlineFactCheck /> },
    { name: "Query", href: "/query", icon: <MdOutlineQueryBuilder /> },
    { name: "Tailor Session Log", href: "/tailorlogs", icon: <MdOutlineFactCheck /> },
    { name: "Sizes", href: "/type-size", icon: <MdOutlineListAlt /> },
    {
      name: "Settings",
      href: "#",
      icon: <MdOutlineSettings />,
      subItems: [
        { name: "Industry Types", href: "/clients", icon: <MdOutlinePerson /> },
        { name: "Parameter", href: "/measurement", icon: <MdOutlineQueryBuilder /> },
      ],
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 1025);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    // Logout functionality here
    // setLogin(false);
    navigate("/");
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find(
      (item) =>
        item.href === currentPath ||
        item.subItems?.some((sub) => sub.href === currentPath)
    );
    if (currentItem) {
      setActiveButton(currentItem.name);
      localStorage.setItem("activeButton", currentItem.name);
    }
  }, [location.pathname]);

  return (
    <div>
      <div
        className={`fixed z-50 h-screen scrollbar-custom  overflow-y-auto  bg-white shadow-lg w-64 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="p-2">
          <Link
            to="/dashboard"
            className="flex items-center space-x-4 border rounded-lg bg-white hover:bg-gray-100 p-2"
          >
            <img
              src={logo}
              alt="User Profile"
              className="h-12 w-12 rounded-full border p-1"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {/* {user?.name || "User Name"} */} User Name
              </p>
              <p className="text-sm text-gray-600 capitalize">
                
                {/* {user?.role} */} Admin
                </p>
            </div>
          </Link>
        </div>

        <ul className="p-4 space-y-6">
          {menuItems.map((item) => {
            const isActive = activeButton === item.name;

            return (
              <li key={item.name}>
                <div className="flex flex-col">
                  <button
                    className={`flex items-center justify-between p-2 rounded ${
                      isActive ? "bg-primary text-white" : "text-black"
                    }`}
                    onClick={() => {
                      if (item.subItems) {
                        handleDropdownToggle(item.name);
                      } else {
                        setActiveButton(item.name);
                        localStorage.setItem("activeButton", item.name);
                        setIsSidebarOpen(false);
                        navigate(item.href);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.subItems && (
                      <FaAngleDown
                        className={`transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {item.subItems && openDropdown === item.name && (
                    <ul className="ml-8 mt-2 space-y-2">
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.href}
                            className={`flex items-center p-2 rounded ${
                              location.pathname === sub.href
                                ? "bg-gray-300"
                                : "text-gray-600"
                            }`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 p-2 rounded text-black hover:bg-gray-200"
            >
              <FaSignOutAlt className="h-6 w-6" />
              <span>Logout</span>
            </button>
          </li>
        </ul>

        <div className="p-4 mt-auto">
          <div className="border bg-primary text-white rounded-lg p-6">
            <div className="flex items-start space-x-2">
              <img
                src={logo}
                alt="Support"
                className="h-12 w-12 rounded-full border p-1"
              />
              <div>
                <h2 className="font-semibold">Need Help?</h2>
                <p className="text-xs">Our team is here to assist you!</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <a
                href="tel:+919363959787"
                className="bg-white text-black text-sm py-2 px-4 rounded-full flex items-center gap-2"
              >
                <FaPhoneAlt size={19} />
                <span>+91 9363959787</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default  Sidebar;
