import React, { useState, useRef, useEffect } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { ProductService } from "@/services/product.service";
import { ISearchedProduct } from "@/types/product";
import ListSearchedBox from "./list-searched-box";

interface InputSearchProps {
  type?: string;
  placeholder?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  type = "text",
  placeholder = "Search for products...",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<ISearchedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      setIsLoading(true);
      try {
        const results = await ProductService.searchProducts(value);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="input-search-container" ref={searchRef} style={{ position: 'relative' }}>
      <div className="input-search-search-icon">
        <IoSearch />
      </div>
      <div className="input-search-search-input">
        <input
          type={type}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="input-search-input"
          aria-label="Search input"
        />
      </div>
      {inputValue && (
        <div className="input-search-clear-icon">
          <IoClose
            onClick={() => {
              setInputValue("");
              setSearchResults([]);
              setShowResults(false);
            }}
          />
        </div>
      )}
      {showResults && (
        <ListSearchedBox
          products={searchResults}
          isLoading={isLoading}
          onItemClick={() => {
            setShowResults(false);
            setInputValue("");
          }}
        />
      )}
    </div>
  );
};

export default InputSearch;
