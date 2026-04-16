
import styled from "styled-components";

// 🔥 Styled wrapper (PUT HERE)
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;

  .loader {
    font-size: 1.8rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: "DM Sans", sans-serif;
  }

  .bracket {
    color: #774360;
    opacity: 0.8;
  }

  .text {
    color: #4c3a51;
    letter-spacing: -1em;
    overflow: hidden;
    display: inline-block;
    animation: reveal 1.4s cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate;
  }

  @keyframes reveal {
    0% {
      opacity: 0.4;
      letter-spacing: -1em;
    }
    50% {
      opacity: 1;
      letter-spacing: 0.15em;
    }
    100% {
      opacity: 0.4;
      letter-spacing: -1em;
    }
  }
`;

// 🔥 Component
export default function Loader() {
  return (
    <Wrapper>
      <div className="loader">
        <span className="bracket">&lt;</span>
        <span className="text">LOADING</span>
        <span className="bracket">/&gt;</span>
      </div>
    </Wrapper>
  );
}