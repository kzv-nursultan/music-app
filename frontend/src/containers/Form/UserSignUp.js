import React, {useState} from 'react';
import {Grid, Typography} from "@material-ui/core";
import FormInput from "./FormInput";
import {makeStyles} from "@material-ui/core/styles";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from "@material-ui/core/Button";
import {useDispatch, useSelector} from "react-redux";
import {postUser} from "../../store/actions/UsersActions";
import {NavLink, useHistory} from "react-router-dom";

const useStyles = makeStyles({
    formBlock: {
        display: 'block',
        margin: '10px auto',
        textAlign: 'center'
    },
    mainBlock: {
        flexDirection:'column',
        textAlign:"center",
    },
    title: {
        textTransform:'uppercase',
        marginTop:10,
    },
    link:{
        float:'right',
        marginTop:'35px',
        fontSize:'small'
    }
})

const UserSingUp = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [user, setUser] = useState({
        username:'',
        password:''
    });

    const error = useSelector(state => state.users.error);

    const onChangeHandler = e => {
        const {name, value} = e.target;

        setUser(prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    const getFieldError = fieldName => {
        try {
            return error.errors[fieldName].message;
        } catch (e) {
            return undefined;
        };
    };

    const onSubmitHandler = e => {
        e.preventDefault();
        dispatch(postUser('/users', {...user}));
        if (getFieldError("username")) {
            setTimeout(() => {
                history.push('/');
            }, 1500);
        };
    };

    return (
        <Grid container item xs={12} className={classes.mainBlock}>
            <Typography variant='h4' className={classes.title}>
                <PersonAddIcon fontSize='large' color='action'/>
                <br/>
                <strong>sign up</strong>
            </Typography>
            <form onSubmit={onSubmitHandler} className={classes.formBlock}>
                <FormInput
                    name='username'
                    label='Username'
                    onChange={onChangeHandler}
                    required={true}
                    value={user.username}
                    error={Boolean(getFieldError('username'))}
                    helperText={getFieldError('username')}/>

                <FormInput
                    name='password'
                    label='Password'
                    onChange={onChangeHandler}
                    required={true}
                    value={user.password}
                    type='password'
                    error={Boolean(getFieldError('password'))}
                    helperText={getFieldError('password')}/>
                <Button
                    type='submit'
                    color='primary'
                    variant='contained'>
                    Submit
                </Button>
               <Grid item>
                   <NavLink to='/login' className={classes.link}>
                       Already registered?
                   </NavLink>
               </Grid>
            </form>
        </Grid>
    );
};

export default UserSingUp;