import React from 'react';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';
import { DateRangePicker } from 'react-dates'
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

class SearchParams extends React.Component {
  constructor(props) {
    super(props);

    const exchanges = typeof props.query_exchanges === 'undefined' ? Object.keys(props.exchanges) : props.query_exchanges;
    const pairs = typeof props.pairs === 'undefined' ? '' : props.pairs.join(',');
    const date_start = typeof props.date_start === 'undefined' ? null : props.date_start;
    const date_end = typeof props.date_end === 'undefined' ? null : props.date_end;

    this.state = {
      exchanges,
      pairs,
      date_start,
      date_end,

      date_forcused_input: null,
      focused_input: null,
    };
    this.onExchangeCheck = this.onExchangeCheck.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onExchangeCheck(event) {
    let exchanges;
    const id = event.target.id;

    if (event.target.checked) {
      // checked
      exchanges = Object.keys(this.props.exchanges).filter(exc => this.state.exchanges.includes(exc) || exc === id);
    } else {
      // unchecked
      exchanges = this.state.exchanges.filter(exc => exc !== id);
    }

    this.setState({ exchanges });
  }

  onSearch() {
    const query = {};

    query.exchanges = this.state.exchanges;

    query.pairs = this.state.pairs.split(',')
      .map(pair => pair.trim())
      .filter(pair => pair.length > 0);
    
    if (this.state.date_start !== null) {
      query.date_start = this.state.date_start;
    }
    
    if (this.state.date_end !== null) {
      query.date_end = this.state.date_end;
    }

    this.props.searchcb(query);
  }

  render() {
    return (
      <div>
        <h1>Search</h1>
        <Form>
          <FormGroup>
            <Form.Label>Exhanges</Form.Label>
            {
              Object.keys(this.props.exchanges).map((exc) =>
                <Form.Check
                  key={exc}
                  id={exc}
                  type='checkbox'
                  label={this.props.exchanges[exc]}
                  onChange={this.onExchangeCheck}
                  checked={this.state.exchanges.includes(exc)}
                />
              )
            }
          </FormGroup>
          <FormGroup>
            <Form.Label>Pairs (multiple pairs using ',')</Form.Label>
            <Form.Control
              type='text'
              onChange={(event) => this.setState({ pairs: event.target.value })}
              value={this.state.pairs}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Date (UTC)</Form.Label><br />
            <DateRangePicker
              startDate={this.state.date_start}
              startDateId="id_date_start"
              endDate={this.state.date_end}
              endDateId="id_date_end"
              isOutsideRange={() => false}
              showClearDates={true}
              onDatesChange={({ startDate, endDate }) => this.setState({ date_start: startDate, date_end: endDate })}
              focusedInput={this.state.focused_input}
              onFocusChange={focused_input => this.setState({ focused_input })}
            />
          </FormGroup>
          <Button variant='primary' onClick={this.onSearch}>Search</Button>
        </Form>
      </div>
    );
  }
}

export default SearchParams;