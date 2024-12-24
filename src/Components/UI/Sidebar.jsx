import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTools,
  FaUser,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import {
  MdOutlineDashboard,
  MdOutlineSettings,
  MdOutlinePerson,
  MdOutlineListAlt,
  MdOutlineQueryBuilder,
  MdOutlineFactCheck,
} from "react-icons/md";
import { AiOutlineBranches, AiOutlineUsergroupAdd } from "react-icons/ai";
import logo from "../../Assets/logo.jpeg";

// Sidebar menu items configuration
const SIDEBAR_ITEMS = [
  { name: "Dashboard", href: "/", icon: <MdOutlineDashboard /> },
  {
    name: "Settings",
    href: "#",
    icon: <MdOutlineSettings />,
    subItems: [
      { name: "Client Types", href: "/clients", icon: <MdOutlinePerson /> },
      { name: "Type of Size", href: "/type-size", icon: <MdOutlineListAlt /> },
      { name: "Measurement", href: "/measurement", icon: <MdOutlineQueryBuilder /> },
    ],
  },
  { name: "Tailors", href: "/user", icon: <AiOutlineUsergroupAdd /> },
  {
    name: "Clients",
    href: "#",
    icon: <AiOutlineBranches />,
    subItems: [
      { name: "Client List", href: "/client", icon: <MdOutlineListAlt /> },
      { name: "Branches", href: "/branches", icon: <AiOutlineBranches /> },
    ],
  },
  { name: "OrderProject", href: "/order-project", icon: <MdOutlineFactCheck /> },
  { name: "Query", href: "/query", icon: <MdOutlineQueryBuilder /> },
  { name: "Tailor Session Log", href: "/tailorlogs", icon: <MdOutlineFactCheck /> },
];

// Dropdown Component
const SidebarDropdown = ({ item, isOpen, toggleOpen, isSidebarOpen }) => {
  const location = useLocation();

  return (
    <>
      <motion.div
        onClick={toggleOpen}
        className={`flex items-center font-semibold scrollbar-custom  overflow-y-auto py-2 px-3 mb-2 text-md  rounded-lg cursor-pointer transition-colors
          ${isOpen ? "bg-primary text-white" : "hover:bg-primary hover:text-white text-gray-800"}`}
      >
        {item.icon}
        {isSidebarOpen && (
          <motion.span
            className="ml-4 whitespace-nowrap scrollbar-custom "
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.span>
        )}
        <span className="ml-auto">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="pl-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.subItems.map((subItem) => (
              <Link key={subItem.href} to={subItem.href}>
                <motion.div
                  className={`flex items-center font-medium py-2 px-3 mb-2 text-md rounded-lg transition-colors
                    ${
                      location.pathname === subItem.href
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white text-black"
                    }`}
                >
                  {subItem.icon}
                  {isSidebarOpen && <span className="ml-4">{subItem.name}</span>}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main Sidebar Component
const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({});

  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
      setIsSidebarOpen(!e.matches);
    };

    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const toggleDropdown = (itemName) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [itemName]: !prevState[itemName],
    }));
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-primary ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 220 : 80 }}
    >
      <div className="h-full bg-white  scrollbar-custom  overflow-y-auto shadow-md p-4 flex flex-col">
        <div className={`w-full flex  justify-between mb-6`}>
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${isSidebarOpen ? "h-10" : "h-8 w-8"}`}
          />
          {/* <h1 className="text-primary text-2xl pt-3 font-bold">UMS</h1> */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 transition-colors max-w-fit rounded-full bg-primary text-white"
            disabled={isMobile}
          >
            <HiOutlineMenu size={26} />
          </motion.button>
        </div>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) =>
            item.subItems ? (
              <SidebarDropdown
                key={item.name}
                item={item}
                isOpen={dropdownStates[item.name]}
                toggleOpen={() => toggleDropdown(item.name)}
                isSidebarOpen={isSidebarOpen}
              />
            ) : (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className={`flex items-center font-semibold py-2 px-3 mb-2 text-sm rounded-lg transition-colors
                    ${
                      location.pathname === item.href
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white text-black"
                    }`}
                >
                  {item.icon}
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
