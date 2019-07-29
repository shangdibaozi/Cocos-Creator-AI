
export default class Vector2D {

    x : number = 0;
    y : number = 0;

    /**
     *
     */
    constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }

    public static Vec2DNormalize(vec : Vector2D) : Vector2D {
        let result = new Vector2D(vec.x, vec.y);
        return result.Normalize();
    }


    public Assignment(v : Vector2D) : void {
        this.x = v.x;
        this.y = v.y;
    }

    // returns the squared length of a 2D vector
    public LengthSq() : number {
        return this.x * this.x + this.y * this.y;
    }

    public Length() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // returns a vector perpendicular to this vector
    public Perp() : Vector2D {
        return new Vector2D(-this.y, this.x);
    }

    public Normalize() : Vector2D {
        let vector_length : number = this.Length();
        if(vector_length > cc.macro.FLT_EPSILON) {
            this.x /= vector_length;
            this.y /= vector_length;
        }
        return this;
    }

    public Sub(vec : Vector2D) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x -= vec.x;
        result.y -= vec.y;
        return result;
    }

    public Add(vec : Vector2D) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x += vec.x;
        result.y += vec.y;
        return result;
    }

    public AddSelf(vec : Vector2D) : Vector2D {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public Div(val : number) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x /= val;
        result.y /= val;
        return result;
    }

    public Mult(val : number) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x *= val;
        result.y *= val;
        return result;
    }

    public Dot(vec : Vector2D) : number {
        return this.x * vec.x + this.y * vec.y;        
    }

    public RotateSelf(radians : number) : Vector2D {
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        var x = this.x;
        this.x = cos * x - sin * this.y;
        this.y = sin * x + cos * this.y;
        return this;
    }

    /**
     * returns positive if vec2 is clockwise of this vector,
     * minus if anticlockwise
     * @param vec2 
     */
    public Sign(vec2 : Vector2D) : number {
        if(this.x * vec2.y - this.y * vec2.x > 0) {
            return -1;
        }
        else {
            return 1;
        }
    }
    

    public Truncate(max : number) : void {
        if(this.Length() > max) {
            this.Normalize().Mult(max);
        }
    }
}