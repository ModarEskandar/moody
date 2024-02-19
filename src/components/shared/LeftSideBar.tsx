import React, { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSideBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { pathname: currentpath } = useLocation();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-6">
        <Link to={"/"} className="flex gap-3 items-center ">
          <img
            src="assets/images/moody7.png"
            alt="moody logo"
            className="object-fill h-24 w-full rounded-3xl"
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex-center gap-4 pr-2">
          <img
            src={user.image_url || "/assets/images/profile.png"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          ></img>
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3 ">@${user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = currentpath === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-2 items-center p-4"
                >
                  <img
                    src={link.img_url}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant={"ghost"}
        className="shad-button-ghost justify-start"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" />
        <p className="small-medium lg:base-medium pl-4"> Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
