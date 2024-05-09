import Avatar from "../atoms/Avatar";

interface Props {
  users: {
    avatar: string;
    name: string;
    state: string;
    nickname: string;
  }[];
}

export default function AvatarResultList(props: Props) {
  let { users } = props;

  return (
    <div className="">
      <ul className="max-w-md divide-y divide-gray-700 dark:divide-gray-700">
        {users.map((user, index) => (
          <li className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <Avatar
                  key={index}
                  src={user.avatar}
                  size="sm"
                  alt={user.name}
                  state={user.state}
                  nickname={""}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate dark:text-white">
                  {user.nickname}
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold  dark:text-white">
                YES
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
