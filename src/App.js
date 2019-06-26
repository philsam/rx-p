import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  dateWrapper: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: '50vw',
    margin: '10rem auto'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  bio: {
    display: 'flex',
    width: '20rem'
  },
  fab: {
    marginLeft: '2rem',
  },
  mainTitle: {
    'text-align': 'center'
  },
  plan: {
    display: 'flex',
    padding: '1rem',
    width: '100%'
  },
  search: {
    display: 'flex',
    margin: '2rem auto',
    width: '40vw',
    padding: '0.5rem',
    borderColor: '#333',
    borderWidth: 3,
    borderRadius: 20
  }
}));

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function StudyPlan() {
  const classes = useStyles();
  const topicsProps = [
    { id: 1, name: "Pharmarcy 101", date: null, isStudyPlan: false },
    { id: 2, name: "Pharma and Tech 102", date: null, isStudyPlan: false },
    { id: 3, name: "Pharma and Marketing 103", date: null, isStudyPlan: false },
    { id: 4, name: "BioHazard Levels", date: null, isStudyPlan: false }
  ];

  const [ state, setState ] = useState({
    tabValue: 0, selectedTopic: null, topics: topicsProps, searchResults: []
  });

  const updateState = (updatedValues) => {
    setState({
      ...state,
      ...updatedValues
    });
  };

  function handleSelectTopic(id, event) {
    const { topics } = state;
    const index = topics.findIndex(plan => plan.id === id);
    if(topics[index].isStudyPlan) { // checked
      updateState({ selectedTopic: index });
      updateStudyPlan(null, false);
    } else {
        updateState({ showPicker: true, selectedTopic: index });
    }
  }

  function handleChange(event, newValue) {
    updateState({ tabValue: newValue });
  }

  function handleStudyDate(event, value) {
    updateState({ showPicker: false });
    updateStudyPlan(event.target.value, true);
  }

  const updateStudyPlan = (date = null, isPlan ) => {
    const { selectedTopic, topics } = state;
    let topicsCopy = topics;
    topicsCopy[selectedTopic].isStudyPlan = isPlan;
    topicsCopy[selectedTopic].date = date;
    updateState({ topics: topicsCopy, showPicker: false });
  }

  const removePlan = (planId) => {
    const filteredTopics = state.topics.filter(plan => plan.id !== planId);
    updateState({ topics: filteredTopics });
  }

  const compareDate = (a, b) => {
    let aa = new Date(a.date),
        bb = new Date(b.date);

    if (aa !== bb) {
        if (aa > bb) { return 1; }
        if (aa < bb) { return -1; }
    }
    return aa - bb;
  };

  const displaySortedPlans = () => {
    const plans = state.topics.slice();
    return (
      plans.sort(compareDate).map((plan, index) =>
        plan.isStudyPlan &&
          <div className={classes.plan} key={plan.id}>
            <p>{moment(plan.date).format('MMMM Do YYYY')} - {plan.name} </p>
          </div>
      )
    );
  }

  const filterSearch = (event) => {
    const updatedList = state.topics;
    const filteredList = updatedList.filter(item => {
      return item.name.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    updateState({ searchTerm: event.target.value, searchResults: filteredList });
  };

  const filteredTopics = state.searchResults.length > 0 ? state.searchResults : state.topics;


  return (
      <div className={classes.root}>
        <div className="filter-list">
          <input type="text" className={classes.search} placeholder="Search" onChange={e => filterSearch(e)}/>
        </div>
        <AppBar position="static">
          <Tabs value={state.tabValue} onChange={handleChange}>
            <Tab label="Topics" />
            <Tab label="Study Plan" />
          </Tabs>
        </AppBar>
        {state.tabValue === 0 &&
            <TabContainer>
              <h2 className={classes.mainTitle}> Topics </h2>
              {filteredTopics.map((item, index) =>
                <div className={classes.plan} key={item.id}>
                  <div className={classes.bio}>
                   <Checkbox
                    checked={item.isStudyPlan}
                    onChange={ e => handleSelectTopic(item.id, e)}
                    inputProps={{
                      'aria-label': 'primary checkbox',
                    }}
                   />
                   <p>{item.name}</p>
                  </div>
                  <Fab aria-label="Delete" className={classes.fab}>
                    <DeleteIcon onClick={() => removePlan(item.id)}/>
                  </Fab>
                </div>
              )}
            </TabContainer>
         }
        {state.tabValue === 1 &&
          <TabContainer>
            <h2 className={classes.mainTitle}> Study Plan </h2>
            {displaySortedPlans()}
          </TabContainer>}
        {state.showPicker &&
          <Modal open={state.showPicker}>
            <div>
                <Button variant="contained" color="secondary" className={classes.button}
                  onClick={() => updateState({ showPicker: false })}>
                  Close
                </Button>
              <div className={classes.dateWrapper}>
                <TextField
                  id="date"
                  label="Study Date"
                  type="date"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleStudyDate}
                />
             </div>
            </div>
          </Modal>
        }
     </div>
  );
}
