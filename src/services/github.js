const GITHUB_URL = "https://api.github.com";

export const getUsers = async (username) => {
  try {
    const res = await fetch(`${GITHUB_URL}/search/users?q=${username}`);
    const resJson = res.json();

    if (resJson.errors) {
      throw new Error(resJson.errors);
    }

    return resJson;
  } catch (error) {
    console.error(error);
    return error;
  }
};
