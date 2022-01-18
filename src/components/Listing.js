import './Listing.css'
import React from 'react';
import { Dropdown, FormControl, InputGroup } from 'react-bootstrap';

class Listing extends React.Component {
    //Constructor 
    constructor(props) {
        super(props); //super class to include the props
        this.state = {
            campaignsDetails: [],  //setting the javascript json object to react array to be used
            isLoading: true,
            filterDetails: [],
            searchValue: '',
            sortOption: {}
        };
        this.sortOptionValue = [{
            id: 1, displayName: 'Title (Desc)', sort: 'desc'
        },
        {
            id: 2, displayName: 'Title(Asc)', sort: 'asc'
        },
        {
            id: 3, displayName: 'Total Raised(Desc)', sort: 'desc'
        },
        {
            id: 4, displayName: 'Total Raised(Asc)', sort: 'asc'
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
                    filterDetails: [...responseObj.entries]
                });
            }).then(() => {
                var updatedList = this.state.campaignsDetails.forEach(element => {
                    if (element.deadline) {
                        element.days = this.formatDate(element.deadline);
                    }
                    if (element.total_raised && element.currency) {
                        element.money = this.formatCurrency(element.total_raised, element.currency)
                    }
                    this.setState({
                        ...this.state,
                        campaignsDetails: updatedList
                    })

                });
            })
    }
    //date function for calculation of remaining or elapsed time
    formatDate(time) {
        let dayString = '0 day left';
        var now = Math.abs(new Date() / 1000);
        var diff = (now - time);
        var days = Math.abs(Math.round((diff) / (3600 * 24)));
        //daysObject[0].text = days<0? 'days running': 'days left';
        dayString = days < 0 ? (-days) : days;

        return dayString;
    }
    formatCurrency(amt, currency) {
        //currency list 
        //var currencyList = ["en-US","en-IN","en-CA","jp-JP"]
       // new Intl.NumberFormat('zh-CN', { style: 'currency', currency: currency }).format(amt)
        return new Intl.NumberFormat().format(amt) +" "+ currency;
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
    //OnChange function for the search
    handleSortChange(selectedOption) {
        let data = this.state.campaignsDetails;
        //nested ternary operation for ascending and descending operations
        data = (selectedOption.id === 1 || selectedOption.id === 2) ? (selectedOption.sort === 'asc' ? data.sort(this.sortByTitle) : data.sort(this.sortByTitle).reverse()) :
            (selectedOption.sort === 'asc' ? data.sort(this.sortByFund) : data.sort(this.sortByFund).reverse());

        this.setState({
            ...this.state,
            filterDetails: data //calling the sort
        })
    }
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
        console.log(filterDetails)
        //include a loding symbol or loading component for now simple text
        if (isLoading) return <div>
            <h5 className='loading-txt'>Please wait, until we render the information to you :)</h5>
        </div>;
        return (
            <React.Fragment>
                <section className='container'>
                    <div className='input-group mb-3 '>
                        <InputGroup>
                            {/* Search */}
                            <FormControl type="text" placeholder="Search here!!" onChange={(e) => this.handleSearchChange(e)} />
                            {/* Sort selection dropdown */}
                            <Dropdown variant="outline-secondary" title="Dropdown" id="input-group-dropdown-3">
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="btn border bg-white py-2">
                                    <span className="pe-5 me-5 fs-6 fw-bold text-capitalize" id="shared-usage-card-selected-usage-type">
                                        Sort By
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
                            <div className='col-lg-4 col-md-4 col-xs-4 col-sm-4 mb-3 pe-0'>
                                <div className='card h-100'>
                                    <img src={card.image_url} className='card-img-top' alt='..' />
                                    <div className='card-body'>
                                        <a className='card-title fs-5 text-start  fw-bold text-decoration-none' href={card.url}>{card.title}</a>
                                        <p className='card-text small text-start'>{card.description}</p>
                                    </div>
                                    <div className='card-footer fs-6'>
                                        <div class="row g-0">
                                            <div class="col-6 col-md-6 text-start">
                                                <div>{card.money}</div>
                                                <div className='card-footer-sub-text'>Raised</div>
                                            </div>
                                            <div class="col-6 col-md-6 text-end">
                                                <div>{card.days}</div>
                                                <div className='card-footer-sub-text'>days left</div>
                                            </div>
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
