import './Listing.css'
import React from 'react';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';

class Listing extends React.Component {
    //Constructor 
    constructor(props) {
        super(props); //super class to include the props
        this.state = {
            isLoading: true,
            campaignsDetails: [],  //setting the javascript json object to react array to be used            
            filterDetails: [],
            searchValue: '',
            sortedFilter: {},
            currency: {
                "USD": "$",
                "CHF": "Fr",
                "CAD": "$",
                "GBP": "£",
                "EUR": "€"
            }
        };
        this.sortOptionValue = [
            {
                id: 5, displayName: 'Sort By (Default)', sort: 'desc'
            },
            {
                id: 1, displayName: 'Title (Desc)', sort: 'desc'
            },
            {
                id: 2, displayName: 'Title (Asc)', sort: 'asc'
            },
            {
                id: 3, displayName: 'Total Raised (Desc)', sort: 'desc'
            },
            {
                id: 4, displayName: 'Total Raised (Asc)', sort: 'asc'
            }];
        this.handleSortChange = this.handleSortChange.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }
    //exclusive function to execute fetch part inside the class
    componentDidMount() {
        fetch('https://static.fundrazr.com/assignment/campaigns.json').then((response) => response.json())
            .then((responseObj) => {

                this.setState({
                    ...this.state,
                    campaignsDetails: responseObj.entries,
                    isLoading: false,
                    filterDetails: [...responseObj.entries],
                    sortedFilter: {
                        id: 1, displayName: 'Title (asc)', sort: 'asc'
                    }
                });
            }).then(() => {
                this.state.campaignsDetails.forEach(element => {
                    if (element.deadline) {
                        element.days = this.formatDate(element.deadline);
                    }
                    if (element.total_raised && element.currency) {
                        element.money = this.formatCurrency(element.total_raised, element.currency)
                    }
                    this.setState({
                        ...this.state
                        //calling the search
                    })
                });
                this.handleSortChange(this.state.sortedFilter);
            })
    }
    //date function for calculation of remaining or elapsed time
    formatDate(time) {
        let dayValue = 0;
        var now = Math.abs(new Date() / 1000);
        var diff = (now - time);
        var days = Math.abs(Math.round((diff) / (3600 * 24)));
        //daysObject[0].text = days<0? 'days running': 'days left';
        dayValue = days < 0 ? (-days) : days;

        return dayValue;
    }
    formatCurrency(amt, currency) {
        //currency list 
        //var currencyList = ["en-US","en-IN","en-CA","jp-JP"]
        // new Intl.NumberFormat('zh-CN', { style: 'currency', currency: currency }).format(amt)
        return (this.state.currency[currency]) + (amt / 1000).toFixed(1).toString() + "k";
    }

    //Sort functionality
    //compare the title and also handling multiple languages
    sortByTitle(x, y) {
        return new Intl.Collator('en').compare(x.title, y.title)
    }
    //function to compare the total raised money (only considering the value , no real time conversion check )
    sortByFund(x, y) {
        return (x.total_raised - y.total_raised)
    }
    //OnChange function for the sort
    handleSortChange(selectedOption) {
        let data = [...this.state.campaignsDetails];
        //nested ternary operation for ascending and descending operations
        if (selectedOption.id !== 5) {
            data = (selectedOption.id === 1 || selectedOption.id === 2) ? (selectedOption.sort === 'asc' ? data.sort(this.sortByTitle) : data.sort(this.sortByTitle).reverse()) :
                (selectedOption.sort === 'asc' ? data.sort(this.sortByFund) : data.sort(this.sortByFund).reverse());
        }
        this.setState({
            ...this.state,
            filterDetails: data, //calling the sort
            sortedFilter: selectedOption
        })
    }
    //Onchange function for the search
    handleSearchChange(event) {
        let value = event.target.value.toLowerCase();
        if (value !== '') {
            let resultObject = this.state.campaignsDetails.filter((data) => {
                return (data.title.toLowerCase().search(value) !== -1 || data.description.toLowerCase().search(value) !== -1)
            })
            this.setState({
                ...this.state,
                filterDetails: resultObject //calling the search
            })
        } else {
            //reset the list values 
            this.setState({
                ...this.state,
                filterDetails: this.state.campaignsDetails //calling the search
            })
        }
    }

    //sorting 
    render() {
        const { isLoading, filterDetails } = this.state;
        //include a loding symbol or loading component for now simple text
        if (isLoading) return <div>
            <h5 className='loading-txt'>Please wait, until we render the information to you :)</h5>
        </div>;
        return (
            <React.Fragment>
                <section className='container-fluid'>
                    <div className='input-group my-4'>
                        <InputGroup>
                            {/* Search */}
                            <FormControl type="text" placeholder="Search here!!" onChange={(e) => this.handleSearchChange(e)} />
                            {/* Sort selection dropdown */}
                            <Dropdown variant="outline-secondary" title="Dropdown" id="input-group-dropdown-3">
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="btn border bg-white py-2">
                                    <span className="pe-5 me-5 fs-6 fw-bold text-capitalize" id="shared-usage-card-selected-usage-type">
                                        {this.state.sortedFilter.displayName}
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="m-0 p-0 w-100" value={this.sortOptionValue[0]}>
                                    {this.sortOptionValue?.map(value => (
                                        <Dropdown.Item className="py-2 border-bottom text-primary text-capitalize" onClick={() => this.handleSortChange(value)}>
                                            {value.displayName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </InputGroup>
                        {/* Old bootstrap */}
                        {/* <select className='form-select' value={this.state.sortOption} onChange={this.handleSortChange} >
                            {options.map((eachOption) => (
                                <option className='dropdown-item' >{eachOption.displayName}</option>
                            ))}
                        </select> */}
                    </div>
                    {/* Listing  */}
                    <div className='row'>
                        {filterDetails.map((card) => (
                            <div className='col-md-4 col-sm-6 mb-3 col-xl-3'>
                                <div className='card h-100 border border-1  rounded'>
                                    <div className='height-card-formatter'>
                                        <img src={card.image_url} className='card-img-top' alt='..' />
                                    </div>
                                    <div className='card-body overflow-hidden height-card-formatter'>
                                        <a className='title-card p-0 lh-1 fs-5 fw-bold text-start text-decoration-none' href={card.url}>{card.title}</a>
                                        <p className='card-text small text-start'>{card.description}</p>
                                    </div>                                    
                                    <div className="d-flex flex-wrap justify-content-between px-4 py-2 card-footer fs-6">
                                        <div className="d-flex flex-wrap flex-column justify-content-center align-items-center">
                                            <div>{card.money}</div>
                                            <div className='card-footer-sub-text'>Raised</div>
                                        </div>
                                        <div className="d-flex flex-wrap flex-column justify-content-center align-items-center">
                                            <div>{card.days ? card.days : 0}</div>
                                            <div className='card-footer-sub-text'>days left</div>
                                        </div>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                </section>
            </React.Fragment >
        );
    }
}

export default Listing;
