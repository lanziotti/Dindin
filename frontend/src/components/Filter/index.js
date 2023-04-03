import { useEffect, useState } from 'react';
import FilterIcon from '../../assets/filter-icon.svg';
import Chip from '../Chip';
import './styles.css';
import { loadCategories, loadTransactions } from '../../utils/requisitions';


function Filter({ transactions, setTransactions }) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    async function handleClearFilters() {
        const localCategories = [...categories];

        localCategories.forEach(categorie => categorie.checked = false);

        setCategories([...localCategories]);

        const allTransactions = await loadTransactions();

        setTransactions([...allTransactions]);
    }

    async function handleApplyFilters() {
        const localTransactions = await loadTransactions();
        setTransactions([...localTransactions]);

        const categoriesCheckedId = [];

        categories.forEach((categorie) => {
            if (categorie.checked) {
                categoriesCheckedId.push(categorie.id);
            }
        });

        if (!categoriesCheckedId.length) {
            return;
        }

        const onlyFilteredTransactions = localTransactions.filter(
            (transaction) => categoriesCheckedId.includes(transaction.categoria_id)
        );

        setTransactions([...onlyFilteredTransactions]);
    }

    useEffect(() => {
        async function getAllCatergories() {
            const allCategories = await loadCategories();

            allCategories.forEach(categorie => {
                categorie.checked = false;
            });

            setCategories([...allCategories]);
        }

        if (open) {
            getAllCatergories();
        }

    }, [open]);

    return (
        <div className='container-filter'>
            <button
                className='btn-white btn-filter'
                onClick={() => setOpen(!open)}
            >
                <img src={FilterIcon} alt="filter" />
                Filtrar
            </button>


            {open &&
                <div className='filter-body'>
                    <strong>Categoria</strong>
                    <div className='container-categories'>
                        {categories.map((categorie) => (
                            <Chip
                                key={categorie.id}
                                checked={categorie.checked}
                                title={categorie.descricao}
                                id={categorie.id}
                                categories={categories}
                                setCategories={setCategories}
                            />
                        ))}
                    </div>
                    <div className='container-btns-filter'>
                        <button
                            className='btn-white btn-extra-small'
                            onClick={handleClearFilters}
                        >
                            Limpar Filtros
                        </button>
                        <button
                            className='btn-purple btn-extra-small'
                            onClick={handleApplyFilters}
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>

            }

        </div>
    );
}

export default Filter;