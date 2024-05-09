import Avatar from "../atoms/Avatar";

interface Props {
  users: {
    avatar: string;
    name: string;
    state: string;
    nickname: string;
  }[];
}

export default function AvatarList(props: Props) {
  let { users } = props;

  return (
    <div className="flex flex-row items-center">
      {users.map((user, index) => (
        <Avatar
          key={index}
          src={user.avatar}
          size="sm"
          alt={user.name}
          state={user.state}
          nickname={user.nickname}
        />
      ))}
    </div>
  );
}
