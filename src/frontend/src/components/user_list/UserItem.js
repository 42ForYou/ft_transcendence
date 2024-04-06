import React from "react";
import Avatar from "../common/Avatar";
import { Link } from "../../lib/rrfs/index.js";

const UserItem = ({ intra_id, nickname, avatar }) => {
  return (
    <div className="UserItem w-100 p-0">
      <Link to={`/profile/users/${intra_id}`}>
        <div className="p-3">
          <div className="row ps-3 pe-3">
            <div className="col d-flex justify-content-center">
              <Avatar src={avatar} alt={`유저 ${nickname}의 아바타`} diameter={120} />
            </div>
            <div className="col text-center mt-2">{nickname}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserItem;
