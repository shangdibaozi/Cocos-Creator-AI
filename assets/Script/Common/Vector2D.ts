
export default class Vector2D {

    x : number = 0;
    y : number = 0;

    /**
     *
     */
    constructor(x : number = 0, y : number = 0) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public Zero() : Vector2D {
        this.x = 0;
        this.y = 0;
        return this;
    }

    public static Vec2DNormalize(vec : Vector2D) : Vector2D {
        let result = new Vector2D(vec.x, vec.y);
        return result.Normalize();
    }


    public Assignment(v : Vector2D) : Vector2D {
        this.x = v.x;
        this.y = v.y;
        return this;
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

    /**
     * 向量相减，并返回一个新的向量
     * @param vec 
     */
    public Sub(vec : Vector2D) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x -= vec.x;
        result.y -= vec.y;
        return result;
    }

    /**
     * 自身减去这个向量
     * @param vec 
     */
    public SubSelf(vec : Vector2D) : Vector2D {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
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
        console.assert(val > 0, 'val is zero');
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x /= val;
        result.y /= val;
        return result;
    }

    public DivSelf(val : number) : Vector2D {
        console.assert(val > 0, 'val is zero');
        this.x /= val;
        this.y /= val;
        return this;
    }

    /**
     * 乘以一个数值，并返回一个新的Vector2D
     * @param val 数值
     */
    public Mult(val : number) : Vector2D {
        let result : Vector2D = new Vector2D(this.x, this.y);
        result.x *= val;
        result.y *= val;
        return result;
    }

    /**
     * 自身缩放val倍
     * @param val 数值
     */
    public MultSelf(val : number) : Vector2D {
        this.x *= val;
        this.y *= val;
        return this;
    }

    public Dot(vec : Vector2D) : number {
        return this.x * vec.x + this.y * vec.y;        
    }

    public Rotate(radians : number) : Vector2D {
        let v : Vector2D = new Vector2D();
        v.RotateSelf(radians);
        return v;
    }

    public RotateSelf(radians : number) : Vector2D {
        let sin = Math.sin(radians);
        let cos = Math.cos(radians);
        let x = this.x;
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
            this.Normalize().MultSelf(max);
        }
    }

    public static WrapAround(pos : Vector2D, maxX : number, maxY : number) : void {
        if(pos.x > maxX) {
            pos.x = 0;
        }
        if(pos.x < 0) {
            pos.x = maxX;
        }
        if(pos.y < 0) {
            pos.y = maxY;
        }
        if(pos.y > maxY) {
            pos.y = 0;
        }
    }
}