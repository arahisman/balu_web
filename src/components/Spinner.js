import * as React from "react";
import { useSelector } from "react-redux";

export const Spinner = () => {
  const color = "#888";
  const size = 50;
  const fadeInDelay = 1000;
  const theme = useSelector((state) => state.app.theme);

  return (
    <div
      style={{
        width: 140,
        height: 140,
        alignSelf: "center",
        position: 'relative'
      }}
    >
      <p
        style={{
          position: "absolute",
          color: "#555",
          fontWeight:'600',
          top: 43,
          left:37,
          fontSize: 16,
          alignSelf: "center",
        }}
      >
        Загрузка
      </p>
      <img
        style={{
          width: 140,
          height: 140,
          alignSelf: "center",
          tintColor: "#2b2a29",
          transform: [{ rotate: 10 }],
        }}
        src={require("./../icons/spin.png")}
      />
    </div>
  );
};
