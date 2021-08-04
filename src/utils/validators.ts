"use strict";

export default class Validate {
    static user = {
        username: { type: "string", min: 2 },
        password: { type: "string", min: 6 },
        email: { type: "email" },
        bio: { type: "string", optional: true },
        image: { type: "string", optional: true },
    }

}