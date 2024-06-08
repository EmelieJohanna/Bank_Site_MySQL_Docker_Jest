import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Signup from "@/app/signup/page";
import { useRouter } from "next/navigation";

// Mock for useRouter hook
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

describe("Signup", () => {
  test("renders signup form", () => {
    // Render the Signup component
    render(<Signup />);

    // Check if the Signup form elements are present
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText(/Create User/i);

    // Assert that the Signup form elements are present
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});

// describe("Signup", () => {
//   test("submits form when filled", async () => {
//     render(<Signup />);

//     const usernameInput = screen.getByPlaceholderText("Username");
//     const passwordInput = screen.getByPlaceholderText("Password");
//     const submitButton = screen.getByText(/Create User/i);

//     fireEvent.change(usernameInput, { target: { value: "testuser" } });
//     fireEvent.change(passwordInput, { target: { value: "testpassword" } });

//     fireEvent.click(submitButton);

//     const successMessage = await screen.findByText(
//       /Account created successfully/i
//     );
//     expect(successMessage).toBeInTheDocument();
//   });
// });
