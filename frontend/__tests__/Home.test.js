import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  test("renders slideshow", () => {
    render(<Home />);
    const slideshowElement = screen.getByTestId("slideshow");
    expect(slideshowElement).toBeInTheDocument();
  });

  test("renders sign up and login buttons", () => {
    render(<Home />);
    const signupButton = screen.getByText(/Sign up/i);
    const loginButton = screen.getByText(/Login/i);
    expect(signupButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
