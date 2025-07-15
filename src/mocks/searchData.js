const searchData = [
  {
    id: 1,
    type: "resource",
    value: "Record Variables",
    children: [
      {
        id: 11,
        type: "resource",
        value: "Account",
        children: [
          {
            id: 111,
            type: "endpoint",
            value: "Account ID",
          },
          {
            id: 111,
            type: "endpoint",
            value: "Contact ID",
          },
          {
            id: 111,
            type: "endpoint",
            value: "Created By ID",
          },
          {
            id: 111,
            type: "endpoint",
            value: "Individual ID",
          },
          {
            id: 111,
            type: "endpoint",
            value: "Last Modified By ID",
          },
          {
            id: 111,
            type: "endpoint",
            value: "Manager ID",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    type: "resource",
    value: "Global Constants",
    children: [
      {
        id: 21,
        type: "endpoint",
        value: "False",
      },
      {
        id: 22,
        type: "endpoint",
        value: "True",
      },
      {
        id: 23,
        type: "endpoint",
        value: "Blank Value (Empty String)",
      },
    ],
  },
  {
    id: 3,
    type: "resource",
    value: "Global Variables",
    children: [
      {
        id: 31,
        type: "resource",
        value: "API",
        children: [
          {
            id: 311,
            type: "endpoint",
            value: "API Headers",
          },
          {
            id: 312,
            type: "endpoint",
            value: "API Body",
          },
          {
            id: 313,
            type: "endpoint",
            value: "API Response",
          },
        ],
      },
      {
        id: 32,
        type: "resource",
        value: "Custom Hierarchy Settings",
        children: [
          {
            id: 321,
            type: "endpoint",
            value: "API Headers",
          },
          {
            id: 321,
            type: "endpoint",
            value: "API Body",
          },
        ],
      },
    ],
  },
];

export default searchData;
