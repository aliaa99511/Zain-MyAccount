// components/FullPageSpinner.tsx
import spinner from "../../assets/ZainLoader.gif";

export default function FullPageSpinner() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
      }}
    >
      <img src={spinner} alt="Checking session..." width={500} height={300} />
    </div>
  );
}