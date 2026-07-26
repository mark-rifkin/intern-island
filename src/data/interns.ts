export interface Intern {
  id: string;
  imageSrc: string;
  alt: string;
}

export const placeholderImageSrc =
  `${import.meta.env.BASE_URL}interns/placeholder.svg`;

export const interns: Intern[] = Array.from({ length: 6 }, (_, index) => ({
  id: `intern-${index + 1}`,
  imageSrc:
    `${import.meta.env.BASE_URL}interns/headshots/intern-${index + 1}.jpg`,
  alt: "Intern portrait",
}));
