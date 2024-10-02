import Link from "next/link";
import UserIcon from "@/app/assets/icons/UserIcon";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <Link href="/">Metric Master</Link>
      </div>
      <nav className="flex items-center space-x-4">
        <div className="ml-4 p-2 rounded-full bg-gray-700 flex items-center justify-center w-10 h-10">
          <Link href="/user">
            <UserIcon />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
