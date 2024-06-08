import "@testing-library/jest-dom";
import { render, screen, act, fireEvent } from "@testing-library/react";
import SlideShow from "@/app/components/SlideShow";

jest.useFakeTimers();

describe("SlideShow", () => {
  test("renders SlideShow with changing images", () => {
    render(<SlideShow />);

    const initialImage = screen.getByAltText("Slideshow image");
    expect(initialImage).toBeInTheDocument();

    const nextButton = screen.getByText("Next");

    act(() => {
      fireEvent.click(nextButton);
    });

    const nextImage = screen.getByAltText("Slideshow image");
    expect(nextImage).toBeInTheDocument();
    expect(nextImage.src).toContain("/frontpage-bank.webp");

    const prevButton = screen.getByText("Previous");
    act(() => {
      fireEvent.click(prevButton);
    });

    const prevImage = screen.getByAltText("Slideshow image");
    expect(prevImage).toBeInTheDocument();
    expect(prevImage.src).toContain("/boat-bank.webp");
  });
});
