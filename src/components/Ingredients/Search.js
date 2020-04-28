import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import axios from '../../axiosInstance';

const Search = React.memo(props => {
  const { onFilterIngredients } = props;
  const [filter, setFilter] = useState('');
  const filterRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === filterRef.current.value) {
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        axios.get('/ingredients.json' + query).then(res => {
          let ingredients = [];
          for (const key in res.data) {
            ingredients.push({
              id: key,
              ...res.data[key],
            })
          }
          onFilterIngredients(ingredients);
        }).catch(err => console.log(err));
      }
    }, 500);

    return () => {clearTimeout(timer)}

  }, [filter, onFilterIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={filterRef} type="text" value={filter} onChange={(event) => setFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
