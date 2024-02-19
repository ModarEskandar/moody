import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between">
        <Link to={"/"} className="flex gap-3 items-center">
          <img
            src="assets/images/moody7.png"
            alt="moody logo"
            className="object-fill h-14 w-full rounded-3xl"
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant={"ghost"}
            className="shad-button-ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-4 pr-2">
            <img
              src={user.image_url || "/assets/images/profile.png"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            ></img>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
