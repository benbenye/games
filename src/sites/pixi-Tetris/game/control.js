  export const loadProgressHandler = (loader, resources) => {
    console.log("loading: " + resources.url);
    console.log("progress: " + loader.progress + "%");
  }
