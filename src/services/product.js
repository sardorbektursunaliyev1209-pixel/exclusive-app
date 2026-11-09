import { baseUrl } from "./config";

export const Product = () => {
  return fetch(`${baseUrl}/product/list/`, {
    method: "GET",
    redirect: "follow",
  }).then((response) => {
    if (!response.ok) throw new Error("Server xatosi: " + response.status);
    return response.json();
  });
};

export const getCategories = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(`${baseUrl}/product/categories/`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => console.error(error));
};
