/**
 * Sector profiles — the example business each post borrows its details from.
 * Order matches plan.mjs so the plan table and the copy agree.
 *
 * Figures are illustrative examples, not client results. Change them to real
 * numbers from your own market before posting.
 */

export const sectors = [
  {
    key: "bakery",
    biz: "bakery",
    cust: "customer",
    amt: "₦45,000",
    friction: "orders arrive on WhatsApp and get lost",
    tags: ["#LagosBakery", "#SmallBusinessNigeria"],
  },
  {
    key: "fashion",
    biz: "fashion label",
    cust: "customer",
    amt: "₦85,000",
    friction: "sizes and prices only exist in DMs",
    tags: ["#NaijaFashion", "#LagosBusiness"],
  },
  {
    key: "auto",
    biz: "car dealership",
    cust: "buyer",
    amt: "₦12m",
    friction: "the page shows stock photos instead of the actual cars",
    tags: ["#LagosAuto", "#NaijaBusiness"],
  },
  {
    key: "clinic",
    biz: "clinic",
    cust: "patient",
    amt: "₦25,000",
    friction: "appointments can only be booked by phone",
    tags: ["#LagosHealth", "#SmallBusinessNigeria"],
  },
  {
    key: "school",
    biz: "school",
    cust: "parent",
    amt: "₦150,000 a term",
    friction: "fees are only available on request",
    tags: ["#LagosSchools", "#NaijaParents"],
  },
  {
    key: "property",
    biz: "property company",
    cust: "buyer",
    amt: "₦2.5m a year",
    friction: "listings appear without a price",
    tags: ["#LagosRealEstate", "#NaijaProperty"],
  },
  {
    key: "restaurant",
    biz: "restaurant",
    cust: "guest",
    amt: "₦18,000",
    friction: "the menu lives in an Instagram story that expires",
    tags: ["#LagosFood", "#NaijaEats"],
  },
  {
    key: "salon",
    biz: "salon",
    cust: "client",
    amt: "₦35,000",
    friction: "prices are only given in DMs",
    tags: ["#LagosBeauty", "#NaijaBusiness"],
  },
  {
    key: "consultant",
    biz: "consultancy",
    cust: "client",
    amt: "₦450,000",
    friction: "the services are described in jargon",
    tags: ["#LagosBusiness", "#Consulting"],
  },
  {
    key: "logistics",
    biz: "logistics company",
    cust: "customer",
    amt: "₦4,500 per 5kg",
    friction: "rates are only available on request",
    tags: ["#LagosLogistics", "#NaijaBusiness"],
  },
];
