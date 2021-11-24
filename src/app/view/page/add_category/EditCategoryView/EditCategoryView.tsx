import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

import * as Entity from "domain/entity";
import container from "injector";
import { EditCategoryViewModel } from '../../../../view-model';

import ProductItem from "./ProductItem";
import EditProductsModal from "./EditProductsModal";

interface EditCategoryViewInterface {
    categoryId: string;
}

const vm: EditCategoryViewModel = container.get<EditCategoryViewModel>("EditCategoryViewModel");

const EditCategoryView : React.FC<EditCategoryViewInterface> = () => {
    const history = useHistory();
    const categoryId = useLocation<EditCategoryViewInterface>().state.categoryId;
    const [ categoryName, setCategoryName ] = useState<string>("");
    const [ productList, setProductList ] = useState<Entity.Product[]>([]);
    const [ modalState, setModalState ] = useState<boolean>(false);
    const [ selectedItemIds, setSelectedItemIds ] = useState<string[]>([]);
    
    const showProductListModal = () => {
        setModalState(!modalState);
    }

    const getModalState = (isVisible : boolean) => {
        setModalState(isVisible);
    }

    const handleCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    }

    const getSelectedItems = (selectedItems : string[]) => {
        setSelectedItemIds(selectedItems);
    }

    const handleBtnDeleteItem = (selectedItemId: string) => {
        const newArr = selectedItemIds.filter(item => item !== selectedItemId);
        setSelectedItemIds(newArr);

        const removeProduct = {"product": selectedItemId, "category": categoryId};
        vm.removeProductByCategory(removeProduct)
        .then(res => alert("상품이 삭제되었습니다."))
        .catch(err => alert("상품 삭제에 실패하였습니다."));
    }

    const handleBtnDeleteCategory = () => {
        vm.removeCategory(categoryId)
        .then(res => {
            alert("카테고리가 삭제되었습니다.");
            window.location.replace('/category_list');
        })
        .catch(err => alert("카테고리 삭제에 실패하였습니다."));
    }

    const handleBtnSave = () => {
        let productsByCategory: object[] = [];
        selectedItemIds.map(item => productsByCategory.push({"category": categoryId, "product": item}));

        vm.editCategoryName(parseInt(categoryId, 10), categoryName);
        vm.editProductsByCategory(productsByCategory)
        .then(res => {
            alert("해당 카테고리의 상품이 수정되었습니다.");
            history.push('/category_list');
        })
        .catch(err => alert("상품 수정 실패"));
    }

    useEffect(() => {
        vm.getProductsByCategory(categoryId)
        .then((res: any) => {
            setCategoryName(res.name);
            
            const selectedItems = res.productCategory.map((item: {id: number; product: {id: number}}) => item.product.id.toString());
            setSelectedItemIds(selectedItems);
        })
        .catch(err => alert("카테고리별 상품 리스트 불러오기에 실패하였습니다."));

        vm.getProductList()
        .then(res => setProductList(res))
        .catch(err => alert("상품 리스트 불러오기에 실패하였습니다."));
    }, []);

    const selectedProducts = productList.filter(item => selectedItemIds.includes(item.id.toString()));

    return (
        <EditCategoryViewContainer>
            <ModalBackground isVisible={modalState}></ModalBackground>
            <Header>
                    <span>Edit Category</span>
                    <div>
                        <Link to="/category_list"><BtnCancel>Cancel</BtnCancel></Link>
                        <BtnSave onClick={handleBtnSave}>Save</BtnSave>
                    </div>
            </Header>
            <Contents>
                <TitleBox>
                    <p>Title</p>
                    <SetCategoryTitle placeholder="Product Type or Group" value={categoryName} onChange={handleCategoryName}/>
                </TitleBox>
                <ProductsBox>
                    <p>Products</p>
                    <SetProducts placeholder="Search for products" onClick={showProductListModal} readOnly={true} />
                    <SelectedProductList>
                        {selectedProducts.map(item => {
                            return <ProductItem key={item.id} id={item.id} image={item.image} name={item.name} handleBtnDeleteItem={handleBtnDeleteItem}/>
                        })}
                    </SelectedProductList>
                </ProductsBox>
            </Contents>
            <EditProductsModal 
                productList={productList} 
                selectedItemIds={selectedItemIds}
                modalState={modalState} 
                getModalState={getModalState} 
                getSelectedItems={getSelectedItems}
            />
            <BtnDeleteCategory onClick={handleBtnDeleteCategory}>Delete Category</BtnDeleteCategory>
        </EditCategoryViewContainer>
    )
}

const EditCategoryViewContainer = styled.div`
    position: relative;
    height: 100vh;
    background-color: #f7f7f7;
`

const ModalBackground = styled.div<{isVisible: boolean}>`
    display: ${({isVisible}) => isVisible ? "block" : "none"};
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 22px;
    background-color: #ffffff;

    span {
        font-family: NanumSquare_acEB;
        font-size: 20px;
        color: #374554;
    }

    div {
        display: flex;
    }
`
const BtnCancel = styled.button`
    margin-right: 10px;
    padding: 10px 18px;
    border-radius: 4px;
    border: solid 1px #babfc3;
    color: #374554;
    cursor: pointer;
`
const BtnSave = styled.button`
    padding: 10px 24px;
    border-radius: 4px;
    background-color: #e0e0e3;
    color: #ffffff;
    cursor: pointer;
`

const Contents = styled.div`
    padding: 20px;

    p {
        margin-bottom: 10px;
    }
`

const TitleBox = styled.div`
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
    background-color: #fff;
`

const SetCategoryTitle = styled.input`
    width: 100%;
    padding: 16px;
    border-radius: 2px;
    border: solid 1px #eaeaea;
`

const ProductsBox = styled.div`
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
    background-color: #fff;
`

const SetProducts = styled.input`
    width: 100%;
    padding: 16px;
    border-radius: 2px;
    border: solid 1px #eaeaea;
`

const SelectedProductList = styled.div`
    margin-top: 10px;
`

const BtnDeleteCategory = styled.button`
    margin-left: 20px;
    padding: 15px 16px;
    border-radius: 4px;
    border: solid 1px #c85959;
    font-family: NanumSquare_acB;
    color: #c85959;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #c85959;
        color: #ffffff;
    }
`

export default EditCategoryView;