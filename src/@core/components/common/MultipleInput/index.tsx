import React, { useState } from 'react';
import { TextField, Button, Chip, Box, Grid } from '@mui/material';
import { Clear } from '@mui/icons-material';

type IMultipleInput = {
    placeholder: string
    InputArray: string[]
    setInputArray: (value: string[]) => void
}
const MultipleInput = ({ placeholder, InputArray, setInputArray }: IMultipleInput) => {
    const [inputValue, setInputValue] = useState('');

    const removeInput = (index: number) => {
        const newInputArray = [...InputArray];
        newInputArray.splice(index, 1);
        setInputArray(newInputArray);
    };

    const handleSubmit = (event: React.SyntheticEvent) => {
        if (inputValue === '') return;
        setInputArray([...InputArray, inputValue]);
        setInputValue('');
    };

    return (
        <>
            <TextField
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                placeholder={placeholder}
                fullWidth
            />
            <Grid container spacing={4} >
                <Grid item xs={10} sm={10}>
                    <Box marginTop={3}>
                        {
                            InputArray?.length ?
                                InputArray.map((input, index) => (
                                    <Chip
                                        sx={{ marginBottom: 3 }}
                                        key={index}
                                        label={input}
                                        onDelete={() => removeInput(index)}
                                        deleteIcon={<Clear />}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                ))
                                : ''
                        }
                    </Box>
                </Grid>
                <Grid item xs={2} sm={2}>
                    <Button variant="contained" type="button" onClick={handleSubmit} sx={{ marginTop: 5 }}>
                        Add
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default MultipleInput;














