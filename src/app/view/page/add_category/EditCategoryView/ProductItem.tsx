import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface ProductItemInterface {
    id: string;
    image: string[];
    title: string;
    parent?: string;
    isChecked?: boolean;
    getIsItemChecked?: (isChecked: boolean, id: string) => void;
}

const ProductItem : React.FC<ProductItemInterface> = (props) => {
    const [ isChecked, setIsChekced ] = useState<boolean>(false);

    const handleCheckChange = () => {
        setIsChekced(!isChecked);
    }

    useEffect(() => {
        if(props.isChecked) setIsChekced(props.isChecked);
    }, [])


    useEffect(() => {
        if(props.getIsItemChecked) {
            props.getIsItemChecked(isChecked, props.id);
        } 
    }, [isChecked])

    return (
        <ProductItemContainer>
            <div>
                <CheckBox type="checkbox" id={props.id} onChange={handleCheckChange} checked={isChecked} isVisible={props.parent ? true : false} />
                <ProductImage src={props.image[0]} />
                <Title>{props.title}</Title>
            </div>
        </ProductItemContainer>
    )
}

const ProductItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
    
    div {
        display: flex;
        flex: 1;
        align-items: center;
    }
`

const CheckBox = styled.input<{isVisible: boolean}>`
    display: ${({isVisible}) => isVisible ? "block" : "none"};    
    border-radius: 2px;
`
const ProductImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin: 0 10px;
`

const Title = styled.div`
    font-family: NanumSquare_acB;
    font-size: 14px;
    color: #58606e;
`

export default ProductItem;