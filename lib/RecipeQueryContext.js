import React from "react";
import * as JsSearch from "js-search";

export const options = ["all", "sweet", "savoury"];

const defaultState = {
  type: "all",
};
const RecipeQueryContext = React.createContext(defaultState);
function RecipeQueryProvider(props) {
  const { children } = props;
  const [type, setType] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState([]);
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    const dataToSearch = new JsSearch.Search("slug");
    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("slug");
    dataToSearch.addIndex("recipe_name");
    dataToSearch.addIndex("ingredients");
    dataToSearch.addIndex("tags");
    dataToSearch.addDocuments(recipes);
    setSearch(dataToSearch);
  }, [recipes]);

  const changeType = (targetType) => {
    setType(targetType);
  };

  const inputHandler = (inputString) => {
    setQuery(inputString);
  };

  const toggle = (targetState) => {
    setOpen(targetState || !isOpen);
  };

  const reset = () => {
    setType("all");
    setQuery("");
  };

  const setRecipeJson = (data) => {
    setRecipes(data);
  };

  const ctx = {
    type,
    query,
    isOpen,
    changeType,
    inputHandler,
    toggle,
    reset,
    search,
    setRecipeJson,
  };

  return (
    <RecipeQueryContext.Provider value={ctx}>
      {children}
    </RecipeQueryContext.Provider>
  );
}
export default RecipeQueryContext;
export { RecipeQueryProvider };
