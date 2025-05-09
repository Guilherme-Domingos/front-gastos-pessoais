
export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-400 text-white py-2 rounded-full w-full hover:bg-green-500"
    >
      {children}
    </button>
  );
}
