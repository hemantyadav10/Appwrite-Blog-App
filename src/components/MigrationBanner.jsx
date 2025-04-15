import { CloseButton } from "../assets";

const MigrationBanner = ({ setShowNotification, showNotification }) => {

  return (
    <div
      className={`fixed top-16 sm:top-[72px] px-4 py-1 text-xs flex items-center justify-between text-yellow-800 dark:bg-yellow-100 shadow-sm z-40 left-0 right-0 border-y bg-yellow-50 border-yellow-200 "}`}
    >
      <p className="flex-1 font-medium text-center">
        ⚠️ We're in the process of migrating image data. Some images may not display temporarily. We appreciate your patience!
      </p>
      <button
        aria-label="Close migration notice"
        className="px-4 py-[2px] dark:hover:bg-yellow-200 hover:bg-yellow-100"
        onClick={() => setShowNotification(false)}
      >
        <CloseButton />
      </button>
    </div>
  );
};

export default MigrationBanner;
